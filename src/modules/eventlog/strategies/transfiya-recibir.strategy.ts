import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class TransifyaRecibirEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    const additionals= eventObject.CFO.additionals;
    return additionals.sourceDetails.sourceAccount.replace(/-/g, '');
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiary] = eventObject.CFO.beneficiaries;
    return beneficiary.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject) {
    return [];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const cus = eventObject.RQ.messageRQ.additionals?.cus || '';
    idetail.push(
      {
        key: 'cus',
        value: cus,
      },
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
      {
        key: 'message_transaction',
        value: `${eventObject?.CFO?.additionals?.userCustomMessage.replace(/["']/g, '')}`,
      },
    );
    return idetail;
  }
}
