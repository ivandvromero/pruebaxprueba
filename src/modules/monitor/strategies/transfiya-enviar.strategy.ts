import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';
import { TypeTransactionPts } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';
import { Logger } from '@dale/logger-nestjs';

export class TransfiyaEnviarStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private logger: Logger,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    data.transactionTransform.Field_K7_0091 = 'Envio de dinero';
    data.transactionTransform.Field_K7_0092 = TypeTransactionPts.EnviarDale2;

    const additionals = eventObject.RQ.messageRQ.additionals;
    data.transactionTransform.Field_K7_0104 = additionals?.userCustomMessage
      ?.replace(/["']/g, '')
      .substring(0, 20);
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
    const phone =
      eventObject.CFO.additionals.beneficiaryDetails.beneficiaryAccount.replace(
        /-/g,
        '',
      );
    clientDestination.Field_K7_0036 = phone.startsWith('57')
      ? phone.slice(2)
      : phone;

    return {
      clientDestination,
    };
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
        const ordererCellPhone =
          eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
            /-/g,
            '',
          );
        const [debitInfo] = confirmations
          .filter((confirm) => confirm.data.amount < 0)
          .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
        const debitDate = this.daleNotificationService.getDateInformation(
          debitInfo.data.creationDate,
        );
        const [beneficiaries] = eventObject.CFO.beneficiaries;
        const beneficiaryName = beneficiaries.additionals.beneficiary?.BP?.name;
        const debitKeys: Key[] = this.daleNotificationService.getSmsKeys(
          amount,
          debitDate,
          beneficiaryName,
        );

        await this.daleNotificationService.sendSmsNotification(
          eventObject,
          '57',
          ordererCellPhone,
          false,
          '016',
          debitKeys,
        );
      }
    } catch (error) {
      this.logger.error('Error sms notification send money');
    }
  }
}
