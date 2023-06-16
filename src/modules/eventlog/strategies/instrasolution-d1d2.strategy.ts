import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class IntrasolutionD1D2EventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin(eventObject) {
    return '';
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject) {
    return ['COM0005', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const originAccount =
      bodyRSresponses.additionals.sourceDetails?.sourceAccount ?? '';
    idetail.push({
      key: 'type',
      value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
    });
    idetail.find((element, i) => {
      if (element.key == 'origin_account') {
        idetail[i] = { key: 'origin_account', value: originAccount };
        return true;
      }
    });
    return idetail;
  }
}
