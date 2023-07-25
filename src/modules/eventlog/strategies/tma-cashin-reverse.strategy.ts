import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class TMACashInReverseEventLogStrategy implements EventLogStrategy {
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
    return ['COM0017R', 'IVA1001R', 'GMF1001R'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    const destiny =
      beneficiaries.additionals.sourceDetails?.sourceAccount ?? '';
    idetail.find((element, i) => {
      if (element.key == 'destiny_account') {
        idetail[i] = { key: 'destiny_account', value: destiny };
        return true;
      }
    });
    idetail.push(
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
      {
        key: 'reference1',
        value: '',
      },
      {
        key: 'reference2',
        value:
          eventObject.RS.messageRS.responses[0].additionals.S125_REF2 ?? '',
      },
      {
        key: 'reference3',
        value:
          eventObject.RS.messageRS.responses[0].additionals.S125_REF3 ?? '',
      },
      {
        key: 'bank_origin',
        value: '0097',
      },
      {
        key: 'account_type',
        value: 'SDA',
      },
    );
    return idetail;
  }
  public doAlgorithm(baseEventLog) {
    return baseEventLog;
  }
}
