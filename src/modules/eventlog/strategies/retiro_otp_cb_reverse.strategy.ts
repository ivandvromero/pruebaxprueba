import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { formatDateTransactionEmpty } from '../../../utils/transform-class';

export class RetiroCbOtpReverseEventLogStrategy implements EventLogStrategy {
  doAlgorithm(baseEventLog) {
    const mappedDetails = formatDateTransactionEmpty(baseEventLog);
    baseEventLog.details = mappedDetails;
    return baseEventLog;
  }

  public getCellPhoneOrigin() {
    return '';
  }

  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators() {
    return ['COM0002R', 'IVA1001R', 'GMF1001R'];
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
