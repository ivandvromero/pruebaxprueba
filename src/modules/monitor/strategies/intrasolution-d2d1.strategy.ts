//Libraries
import { Injectable } from '@nestjs/common';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';

//Enums
import { TypeTransactionPts } from '../../../config/env/env.config';
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

//Interfaces
import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

@Injectable()
export class IntrasolutionD2D1Strategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    try {
      const [bodyResponses] = eventObject.RS.messageRS.responses;
      const confirmations = bodyResponses.confirmations;
      const [withdrawalData] = confirmations
        .filter((confirm) => confirm.data.amount < 0)
        .sort((a, b) => (a.data.id > b.data.id ? -1 : 0));
      const accountBalances = withdrawalData.data.accountBalances.totalBalance;
      data.productOriginTransform.Field_K7_0066 = Number(accountBalances);
      data.transactionTransform.Field_K7_0092 =
        TypeTransactionPts.INT_TRAN_DO_DALE2;
      data.transactionTransform.Field_K7_0091 = 'Intrasolucion';
      data.transactionTransform.Field_K7_0104 = eventObject.CFO.general
        .transactionDetails
        ? eventObject.CFO.general.transactionDetails
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .substring(0, 20)
        : '';
      await this.sendSmsNotification(eventObject);
      return data;
    } catch (error) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON009, error);
    }
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    const [beneficiary] = eventObject.RQ.messageRQ.beneficiaries;
    const beneficiaryAccount = beneficiary.account.othersId.identificationId;
    const productDestination = {
      Field_K7_0072: 'DPE',
      Field_K7_0075: '170000',
      Field_K7_0076: beneficiaryAccount,
    };
    return { productDestination };
  }

  async getClientDestination(externalId: string, eventObject: MessageEvent) {
    return { clientDestination: {} };
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    return eventObject.CFO.orderer.additionals.ordererBP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    return { externalId: '' };
  }

  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const statusRSData = eventObject.RS.statusRS;
    if (statusRSData.code === '0') {
      const amount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponse] = eventObject.RS.messageRS.responses;
      const confirmations = bodyRSresponse.confirmations;
      const [withdrawalInfo] = confirmations
        .filter((confirm) => confirm.data.amount < 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const debitDate = this.daleNotificationService.getDateInformation(
        withdrawalInfo.data.creationDate,
      );
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      const beneficiaryName =
        beneficiaries?.additionals?.beneficiary?.BP?.name ?? 'dale 1.0';
      const debitKeys: Key[] = this.daleNotificationService.getSmsKeys(
        amount,
        debitDate,
        beneficiaryName,
      );
      const ordererCellPhone =
        eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
          /-/g,
          '',
        );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        ordererCellPhone,
        false,
        '011',
        debitKeys,
      );
    }
  }
}
