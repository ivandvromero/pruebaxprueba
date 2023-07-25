import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import {formatDateTransactionEmpty} from '../../../utils/transform-class';

export class CashinPseStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    return '';
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject) {
    return ['COM0001', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    idetail.push(
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
      {
        key: 'operation',
        value: 'internal',
      },
    );
    return idetail;
  }
  doAlgorithm(baseEventLog?: any) {
    const mappedDetails = formatDateTransactionEmpty(baseEventLog);
    baseEventLog.details = mappedDetails;
    return baseEventLog;
  }
}
