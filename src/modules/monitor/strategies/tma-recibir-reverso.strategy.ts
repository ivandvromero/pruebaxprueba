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
import {
  Key,
  DateInfo,
} from '../../../providers/dale/dto/dale-notification.dto';

@Injectable()
export class TmaRecibirReversoStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
  ) {}

  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
  ) {
    const clientDestination = { Field_K7_0031: '' };
    return {
      clientDestination,
    };
  }

  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    return { productDestination: { Field_K7_0072: 'D' } };
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    const [beneficiary] = eventObject.CFO.beneficiaries;
    return beneficiary.additionals.beneficiary.BP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    return { externalId: '' };
  }
  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const transactionStatus = eventObject.RS.statusRS;
    if (transactionStatus.code === '0') {
      const transactionAmount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponse] = eventObject.RS.messageRS.responses;
      const [creditData] = bodyRSresponse.confirmations
        .filter((confirm) => confirm.data.amount < 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const creditDateInfo: DateInfo =
        this.daleNotificationService.getDateInformation(
          creditData.data.creationDate,
        );

      const beneficiary = this.getOrderer(eventObject);
      const beneficiaryCellPhone = beneficiary.cellPhone.replace(/-/g, '');
      const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
        transactionAmount,
        creditDateInfo,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiaryCellPhone,
        false,
        '018',
        creditKeys,
      );
    }
  }
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'TMARecibiRever';
    await this.sendSmsNotification(eventObject);
    return data;
  }
}
