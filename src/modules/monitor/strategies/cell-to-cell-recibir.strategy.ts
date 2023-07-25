//Libraries
import { Injectable } from '@nestjs/common';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

//Interfaces
import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { TypeTransactionPts } from '../../../config/env/env.config';
import {
  Key,
  DateInfo,
} from '../../../providers/dale/dto/dale-notification.dto';

@Injectable()
export class Cell2cellRecibirStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'Recibir dinero';
    data.transactionTransform.Field_K7_0092 =
      TypeTransactionPts.Cell2CellRecibir;
    await this.sendSmsNotification(eventObject);
    return data;
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    const productDestination = { Field_K7_0075: '', Field_K7_0076: '' };
    const additionals = eventObject.CFO.additionals;
    productDestination.Field_K7_0075 = eventObject.RQ.messageRQ.bankId;
    productDestination.Field_K7_0076 =
      additionals.beneficiaryDetails.beneficiaryAccount.replace(/-/g, '');
    return { productDestination };
  }
  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
  ) {
    return { clientDestination: {} };
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    return { externalId: '' };
  }
  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const statusRS = eventObject.RS.statusRS;
    if (statusRS.code === '0') {
      const amount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponses] = eventObject.RS.messageRS.responses;
      const [creditInfo] = bodyRSresponses.confirmations
        .filter((confirm) => confirm.data.amount > 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const creditDate: DateInfo =
        this.daleNotificationService.getDateInformation(
          creditInfo.data.creationDate,
        );

      const beneficiary = this.getOrderer(eventObject);
      const beneficiaryCellPhone = beneficiary.cellPhone.replace(/-/g, '');
      const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
        amount,
        creditDate,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiaryCellPhone,
        false,
        '014',
        creditKeys,
      );
    }
  }
}
