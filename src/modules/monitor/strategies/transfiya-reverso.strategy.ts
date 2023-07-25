import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';

export class TransfiyaReversoStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger
    ) {}

  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'TransfiReverso';
    data.transactionTransform.Field_K7_0092 = TypeTransactionPts.RecibirDale2;
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
      const statusRS = eventObject.RS.statusRS;
      if (statusRS.code === '0') {
        const amount = eventObject.CFO.general.transactionAmount;
        const [bodyRSresponses] = eventObject.RS.messageRS.responses;
        const confirmations = bodyRSresponses.confirmations;
        const [beneficiaries] =eventObject.CFO.beneficiaries;
        const cellPhone =
        beneficiaries.additionals.beneficiary.BP.cellPhone.replace(
          /-/g,
          '',
        );
        const [creditInfo] = confirmations
          .filter((confirm) => confirm.data.amount > 0)
          .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
        const date = this.daleNotificationService.getDateInformation(
          creditInfo.data.creationDate,
        );

        const keys: Key[] = this.daleNotificationService.getSmsKeys(
          amount,
          date,
          '',
        );

        await this.daleNotificationService.sendSmsNotification(
          eventObject,
          '57',
          cellPhone,
          false,
          '026',
          keys,
        );
      }
    } catch (error) {
      this.logger.error('Error sms notification send money reverse');
    }
  }
}
