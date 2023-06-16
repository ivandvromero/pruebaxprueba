import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class TMARecibirEventLogStrategy implements EventLogStrategy {
  public getCellPhoneOrigin() {
    return '';
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiary] = eventObject.CFO.beneficiaries;
    return beneficiary.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators() {
    return ['COM0005', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail): Array<IDetails> {
    const originAccount =
      eventObject.CFO.additionals.sourceDetails?.sourceAccount ?? '';
    idetail.find((element, i) => {
      if (element.key == 'origin_account') {
        idetail[i] = { key: 'origin_account', value: originAccount };
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
        value: eventObject.RS.messageRS.responses[0].additionals.S125_REF2,
      },
      {
        key: 'reference3',
        value: eventObject.RS.messageRS.responses[0].additionals.S125_REF3,
      },
      {
        key: 'bank_origin',
        value:
          eventObject.RS.messageRS.responses[0].additionals.sourceDetails
            .sourceBankId,
      },
      {
        key: 'document_number_origin',
        value: '',
      },
      {
        key: 'account_type',
        value: 'SDA',
      },
    );
    return idetail;
  }
}
