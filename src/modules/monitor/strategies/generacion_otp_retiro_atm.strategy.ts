import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';
import { BaseTransform } from '../../../providers/context/provider-context';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { ProductDestinationTransform } from '../../../shared/manage-transform/class-transform/productDestinationTransform';
import { ClientDestinationTransform } from '../../../shared/manage-transform/class-transform/clientDestinationTransform';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Logger } from '@dale/logger-nestjs';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';

export class GeneracionOtpRetiroAtmStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.productOriginTransform.Field_K7_0064 = '';
    data.productOriginTransform.Field_K7_0066 = 0;
    data.productDestinationTransform.Field_K7_0082 = '';
    data.transactionTransform.Field_K7_0088 = 0;
    data.transactionTransform.Field_K7_0091 = 'OTP';
    data.transactionTransform.Field_K7_0092 = TypeTransactionPts.Retiro_ATM_OTP;
    data.transactionTransform.Field_K7_0095 = '';
    data.transactionTransform.Field_K7_0096 = 0;
    data.transactionTransform.Field_K7_0097 = 0;
    data.transactionTransform.Field_K7_0098 = 'AT';
    data.transactionTransform.Field_K7_0104 = eventObject.CFO.general
      .transactionDetails
      ? eventObject.CFO.general.transactionDetails
          .substring(0, 20)
          .replace(/["']/g, '')
      : '';
    await this.sendSmsNotification(eventObject);

    return data;
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    const productDestination = new ProductDestinationTransform();
    productDestination.Field_K7_0072 = 'DE2';
    productDestination.Field_K7_0075 = '';
    const dataProduct = {
      productDestination,
    };
    return dataProduct;
  }

  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
  ) {
    const clientDestination = new ClientDestinationTransform();
    clientDestination.Field_K7_0042 = '';
    return { clientDestination };
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    return eventObject.CFO.orderer.additionals.ordererBP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    return { externalId: '0' };
  }

  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    try {
      const statusRS = eventObject.RS.statusRS;
      if (statusRS.code === '0') {
        const amount = eventObject.CFO.general.transactionAmount;
        const [bodyRSresponses] = eventObject.RS.messageRS.responses;
        const confirmations = bodyRSresponses.confirmations;
        const [debitInfo] = confirmations
          .filter((confirm) => confirm.data.amount < 0)
          .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
        const debitDate = this.daleNotificationService.getDateInformation(
          debitInfo.data.creationDate,
        );
        const ordererName = eventObject.CFO.orderer.additionals.ordererBP.name;
        const debitKeys: Key[] = this.daleNotificationService.getSmsKeys(
          amount,
          debitDate,
          ordererName,
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
          '022',
          debitKeys,
        );
      }
    } catch (error) {
      this.logger.error('Error sms notification atm retiro CB otp');
    }
  }
}
