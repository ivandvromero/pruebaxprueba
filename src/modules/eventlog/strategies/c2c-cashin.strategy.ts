import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';

export class Cell2CellCashInEventLogStrategy implements EventLogStrategy {
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
    const sourceAccount =
      bodyRSresponses.additionals.sourceDetails?.sourceAccount ?? '';
    const sourceBank =
      bodyRSresponses.additionals.sourceDetails?.sourceBankId ?? '0000';
    const accountType =
      eventObject.CFO.orderer.account.legacyId?.accountType ?? '';
    idetail.push(
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
      {
        key: 'bank_origin',
        value: sourceBank,
      },
      {
        key: 'account_type',
        value: accountType,
      },
    );
    idetail.find((element, i) => {
      if (element.key == 'origin_account') {
        idetail[i] = { key: 'origin_account', value: sourceAccount };
        return true;
      }
    });
    return idetail;
  }
  public doAlgorithm(baseEventLog) {
    return baseEventLog;
  }
}
