import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';

export class PanelAdminDepositEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject: MessageEvent) {
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
    const reason =
      eventObject.RQ.messageRQ.additionals.general?.transactionDetails ?? '';
    idetail.push(
      {
        key: 'reason',
        value: reason,
      },
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
    );
    return idetail;
  }

  public doAlgorithm(baseEventLog) {
    return baseEventLog;
  }
}
