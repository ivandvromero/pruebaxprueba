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
export class Cell2cellEnviarReversoStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    const [bodyResponses] = eventObject.RS.messageRS.responses;
    const confirmations = bodyResponses.confirmations;
    const [withdrawalData] = confirmations
      .filter((confirm) => confirm.data.amount > 0)
      .sort((a, b) => (a.data.id > b.data.id ? -1 : 0));
    const accountBalance = withdrawalData.data.accountBalances.totalBalance;
    data.productOriginTransform.Field_K7_0066 = Number(accountBalance);
    await this.sendSmsNotification(eventObject);
    return data;
  }
  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
  ) {
    return {};
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP;
  }

  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    return {};
  }

  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const statusRS = eventObject.RS.statusRS;
    if (statusRS.code === '0') {
      const transactionAmount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponse] = eventObject.RS.messageRS.responses;
      const [creditData] = bodyRSresponse.confirmations
        .filter((confirm) => confirm.data.amount > 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const creditDate: DateInfo =
        this.daleNotificationService.getDateInformation(
          creditData.data.creationDate,
        );

      const beneficiaryData = this.getOrderer(eventObject);
      const beneficiaryCellPhone = beneficiaryData.cellPhone.replace(/-/g, '');
      const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
        transactionAmount,
        creditDate,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiaryCellPhone,
        false,
        '015',
        creditKeys,
      );
    }
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    return { externalId: '' };
  }
}
