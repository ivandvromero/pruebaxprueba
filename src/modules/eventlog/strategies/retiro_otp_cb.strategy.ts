import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { formatDateTransactionEmpty } from '../../../utils/transform-class';

export class RetiroCbOtpEventLogStrategy implements EventLogStrategy {
  doAlgorithm(baseEventLog) {
    const mappedDetails = formatDateTransactionEmpty(baseEventLog);
    baseEventLog.details = mappedDetails;
    return baseEventLog;
  }

  public getCellPhoneOrigin(eventObject) {
    return eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
      /-/g,
      '',
    );
  }

  public getCellPhoneDestiny() {
    return '';
  }

  public getOperators() {
    return ['COM0002', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const additionals = eventObject.CFO.additionals;
    idetail.push(
      {
        key: 'branchId',
        value: additionals?.branchId ?? '',
      },
      {
        key: 'branch_type',
        value: 'CB',
      },
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
    );
    return idetail;
  }
}
