import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import {
  IDetails,
} from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { formatDateTransactionEmpty } from '../../../utils/transform-class';

export class RecargaCbEventLogStrategy implements EventLogStrategy {
  doAlgorithm(baseEventLog) {
    const mappedDetails = formatDateTransactionEmpty(baseEventLog);
    baseEventLog.details = mappedDetails;
    return baseEventLog;
  }
  
  public getCellPhoneOrigin(eventObject) {
    return '';
  }
  public getCellPhoneDestiny(eventObject: MessageEvent) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(
      /-/g,
      '',
    );
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
