import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import {
  IDetails,
} from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class RetiroAtmOtpEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    return eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
      /-/g,
      '',
    );
  }
  public getCellPhoneDestiny(eventObject) {
    return '';
  }

  public getOperators(eventObject) {
    return ['COM0001', 'IVA1001', 'GMF1001'];
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
