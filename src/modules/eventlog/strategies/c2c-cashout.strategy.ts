import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class Cell2CellCashOutEventLogStrategy implements EventLogStrategy {
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
    return ['COM0005', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const beneficiaryAccount =
      eventObject.RQ.messageRQ.additionals.beneficiaryDetails
        ?.beneficiaryAccount ?? '';
    idetail.push({
      key: 'type',
      value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
    });
    idetail.find((element, i) => {
      if (element.key == 'destiny_account') {
        idetail[i] = { key: 'destiny_account', value: beneficiaryAccount };
        return true;
      }
    });
    return idetail;
  }
  public doAlgorithm(eventObject) {
    return eventObject;
  }
}
