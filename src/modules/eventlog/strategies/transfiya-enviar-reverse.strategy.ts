import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import {
  IDetails,
} from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class TransifyaEnviarReverseEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    return '';
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject) {
    return ['COM0017R', 'IVA1001R', 'GMF1001R'];
  }
  
  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const cus = eventObject?.RQ?.messageRQ?.additionals?.cus || '';
    const [beneficiaries] = eventObject.CFO.beneficiaries;
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
        value: `${beneficiaries.additionals?.userCustomMessage.replace(/["']/g, '')}`,
      },
    );
    return idetail;
  }
  public doAlgorithm(eventObject) {
    return eventObject;
  }
}
