import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';
import { Logger } from '@dale/logger-nestjs';

export class TransifyaRecibirStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'Recibir dinero';
    data.transactionTransform.Field_K7_0092 = TypeTransactionPts.RecibirDale2;
    data.transactionTransform.Field_K7_0104 =
      eventObject?.CFO?.additionals?.userCustomMessage
        .replace(/["']/g, '')
        .substring(0, 20);

    data.futureUseTransform.Field_K7_0137 = eventObject.CFO.additionals.cus;

    const phone = eventObject.CFO.additionals.sourceDetails.sourceAccount
    data.deviceTransform.Field_K7_0132 = Number(phone.startsWith('57') ? phone.slice(2) : phone);

    data.productOriginTransform.Field_K7_0064 =
      eventObject?.CFO?.beneficiaries[0].account.othersId.identificationId;
      
    await this.sendSmsNotification(eventObject);
    return data;
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    return { productDestination: {} };
  }
  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
  ) {
    const clientDestination = { Field_K7_0036: '' };
    const phone = eventObject.CFO.additionals.sourceDetails.sourceAccount.replace(/-/g, '');
    clientDestination.Field_K7_0036 = phone.startsWith('57') ? phone.slice(2) : phone;  
    return {
      clientDestination,
    };
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
        const [creditInfo] = confirmations
          .filter((confirm) => confirm.data.amount > 0)
          .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
        const creditDate = this.daleNotificationService.getDateInformation(
          creditInfo.data.creationDate,
        );
        const [beneficiaries] = eventObject.CFO.beneficiaries;
        const beneficiaryName = beneficiaries.additionals.beneficiary?.BP?.name;
        const beneficiaryCellPhone =
          beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
        const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
          amount,
          creditDate,
          beneficiaryName,
        );

        await this.daleNotificationService.sendSmsNotification(
          eventObject,
          '57',
          beneficiaryCellPhone,
          false,
          '019',
          creditKeys,
        );
      }
    } catch (error) {
      this.logger.error('Error sms notification receive money');
    }
  }
}
