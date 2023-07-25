import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import {
  IDetails,
} from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { formatDateTransactionEmpty } from '../../../utils/transform-class';

export class RecargaCbReverseEventLogStrategy implements EventLogStrategy {
  doAlgorithm(baseEventLog) {
    const mappedDetails = formatDateTransactionEmpty(baseEventLog);
    baseEventLog.details = mappedDetails;
    return baseEventLog;
  }

  public getCellPhoneOrigin(eventObject) {
    const additionals = eventObject.CFO.orderer.additionals;
    return additionals.ordererBP.cellPhone.replace(
      /-/g,
      '',
    );
  }
  public getCellPhoneDestiny(eventObject: MessageEvent) {
    return '';
  }

  public getOperators(eventObject) {
    return ['COM0001', 'IVA1001', 'GMF1001'];
  }
  
  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    idetail.push(
      {
        key: 'type_load',
        value: 'cash',
      },
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
    );
    return idetail;
  }
}
