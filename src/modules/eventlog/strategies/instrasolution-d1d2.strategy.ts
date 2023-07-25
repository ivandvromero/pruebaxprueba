import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

export class IntrasolutionD1D2EventLogStrategy implements EventLogStrategy {
  constructor(private daleNotificationService: DaleNotificationService) {}

  public getCellPhoneOrigin(eventObject) {
    return '';
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject) {
    return ['COM0005', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    this.sendSmsNotification(eventObject);
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const originAccount =
      bodyRSresponses.additionals.sourceDetails?.sourceAccount ?? '';
    idetail.push({
      key: 'type',
      value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
    });
    idetail.push({
      key: 'tx_id_dale1',
      value: eventObject.RQ.messageRQ.transactionId,
    });
    idetail.find((element, i) => {
      if (element.key == 'origin_account') {
        idetail[i] = { key: 'origin_account', value: originAccount };
        return true;
      }
    });
    return idetail;
  }
  public doAlgorithm(eventObject) {
    return eventObject;
  }
  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const statusRSData = eventObject.RS.statusRS;
    if (statusRSData.code === '0') {
      const amount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponse] = eventObject.RS.messageRS.responses;
      const confirmations = bodyRSresponse.confirmations;
      const [credit] = confirmations
        .filter((confirm) => confirm.data.amount > 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const creditDate = this.daleNotificationService.getDateInformation(
        credit.data.creationDate,
      );
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      const beneficiaryName =
        beneficiaries?.additionals?.beneficiary?.BP?.name ?? 'dale 1.0';
      const creditKeys: any[] = this.daleNotificationService.getSmsKeys(
        amount,
        creditDate,
        beneficiaryName,
      );
      const beneficiariesCellPhone =
        beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiariesCellPhone,
        false,
        '012',
        creditKeys,
      );
    }
  }
}
