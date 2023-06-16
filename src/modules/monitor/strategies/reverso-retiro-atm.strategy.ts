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
  DateInfo,
  Key,
} from '../../../providers/dale/dto/dale-notification.dto';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { Logger } from '@dale/logger-nestjs';

@Injectable()
export class RetiroAtmOtpReverseCashStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'ATMReverso';
    data.transactionTransform.Field_K7_0092 =
      TypeTransactionPts.Cell2CellRecibir;
    data.transactionTransform.Field_K7_0102 = 'S';
    data.transactionTransform.Field_K7_0104 = 'observacion reverso';
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
    try {
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
        const [beneficiaries] = eventObject.CFO.beneficiaries;
        const beneficiaryCellPhone =
          beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
        const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
          transactionAmount,
          creditDateInfo,
        );
        await this.daleNotificationService.sendSmsNotification(
          eventObject,
          '57',
          beneficiaryCellPhone,
          false,
          '023',
          creditKeys,
        );
      }
    } catch (error) {
      this.logger.error('Error sms notification atm retiro CB otp');
    }
  }
}
