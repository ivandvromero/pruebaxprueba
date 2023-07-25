import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';
import { BaseTransform } from '../../../providers/context/provider-context';
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { ProductDestinationTransform } from '../../../shared/manage-transform/class-transform/productDestinationTransform';
import { ClientDestinationTransform } from '../../../shared/manage-transform/class-transform/clientDestinationTransform';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RetiroOtpCbStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger,
  ) {}
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    const productDestination = new ProductDestinationTransform();
    return { productDestination };
  }

  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
  ) {
    const clientDestination = new ClientDestinationTransform();
    return { clientDestination };
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    const ordererBP = eventObject.CFO.orderer.additionals.ordererBP;
    return ordererBP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    const externalId = '0';
    return { externalId };
  }

  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    await this.sendSmsNotification(eventObject);
    return data;
  }

  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    try {
      const transactionStatus = eventObject.RS.statusRS;
      if (transactionStatus.code === '0') {
        const [bodyRS] = eventObject.RS.messageRS.responses;
        const confirmations = bodyRS.confirmations;
        const cashoutAmount = eventObject.CFO.general.transactionAmount;
        const [debitInformation] = confirmations
          .filter((confirmation) => confirmation.data.amount < 0)
          .sort((conf1, conf2) => (conf1.data.id < conf2.data.id ? -1 : 0));
        const debitDateTime = this.daleNotificationService.getDateInformation(
          debitInformation.data.creationDate,
        );
        const ordererBP = eventObject.CFO.orderer.additionals.ordererBP;
        const ordererFirstName = ordererBP.name;
        const smsKeys: Key[] = this.daleNotificationService.getSmsKeys(
          cashoutAmount,
          debitDateTime,
          ordererFirstName,
        );
        const ordererCellPhone = ordererBP.cellPhone.replace(/-/g, '');

        await this.daleNotificationService.sendSmsNotification(
          eventObject,
          '57',
          ordererCellPhone,
          false,
          '024',
          smsKeys,
        );
      }
    } catch (error) {
      this.logger.error('Error sending SMS notification for CB OTP withdrawal');
    }
  }
}
