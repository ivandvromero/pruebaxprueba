import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class TransifyaEnviarEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    return eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
      /-/g,
      '',
    );
  }

  public getCellPhoneDestiny(eventObject) {
    const additionals = eventObject.CFO.additionals;
    return additionals.beneficiaryDetails.beneficiaryAccount.replace(
      /-/g,
      '',
    );
  }

  public getOperators(eventObject) {
    return ['COM0017', 'IVA1001', 'GMF1001'];
  }
  
  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const cus = eventObject?.RQ?.messageRQ?.additionals?.cus || '';
    const additionals = eventObject.RQ.messageRQ.additionals;
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
        value: `${additionals?.userCustomMessage?.replace(/["']/g, '')}`,
      },
    );
    return idetail;
  }
}
