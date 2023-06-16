import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import {
  IDetails,
} from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class RetiroAtmOtpReveseEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    return '';
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject) {
    return ['COM0001R', 'IVA1001R', 'GMF1001R'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const additionals = eventObject.CFO.additionals;
    idetail.push(
      {
        key: 'branchId',
        value: `${additionals.branchId}`,
      },
      {
        key: 'branch_type',
        value: 'ATM',
      },
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
    );
    return idetail;
  }
}
