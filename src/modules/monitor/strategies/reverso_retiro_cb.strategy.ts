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
import { Key } from '../../../providers/dale/dto/dale-notification.dto';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { Logger } from '@dale/logger-nestjs';

@Injectable()
export class RetiroCBReverseStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = '';
    data.transactionTransform.Field_K7_0092 =
      TypeTransactionPts.Cell2CellRecibir;
    data.transactionTransform.Field_K7_0102 = '';
    data.transactionTransform.Field_K7_0104 = '';
    await this.sendSmsNotification(eventObject);
    return data;
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    return { productDestination: {} };
  }

  async getClientDestination(externalId: string, eventObject: MessageEvent) {
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
      const confirmations = bodyRSresponses.confirmations;
      const [creditInfo] = confirmations
        .filter((confirm) => confirm.data.amount > 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const creditDate = this.daleNotificationService.getDateInformation(
        creditInfo.data.creationDate,
      );
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      const beneficiaryName = beneficiaries.additionals.beneficiary.BP?.name;
      const beneficiaryCellPhone =
        beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
      const debitKeys: Key[] = this.daleNotificationService.getSmsKeys(
        amount,
        creditDate,
        beneficiaryName,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiaryCellPhone,
        false,
        '027',
        debitKeys,
      );
    }
  }
}
