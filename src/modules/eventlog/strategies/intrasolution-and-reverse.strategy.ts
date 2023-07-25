//Strategy
import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { MessageEvent } from '../../../dto/content.dto';
import { credit_ordinals } from '../constants/api';

export class IntrasolutionAndReverseEventLogStrategy
  implements EventLogStrategy
{
  public getCellPhoneOrigin(eventObject: MessageEvent) {
    return eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
      /-/g,
      '',
    );
  }
  public getCellPhoneDestiny(eventObject) {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
  }

  public getOperators(eventObject, type) {
    // si continene reverso poner las R a todos
    const reverse = this.getIsReverse(eventObject);
    return reverse && type == 'credit'
      ? ['COM0005R', 'IVA1001R', 'GMF1001R']
      : ['COM0005', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail, type): Array<IDetails> {
    const [beneficiary] = eventObject.CFO.beneficiaries;
    const reverse = this.getIsReverse(eventObject);
    const originAccount =
      eventObject.CFO.orderer.account.othersId.identificationId;
    const beneficiaryAccount = beneficiary.account.othersId.identificationId;
    if (type == 'credit') {
      this.creditDetails(eventObject, idetail, type, reverse);
    }
    this.findAndReplaceKey(
      idetail,
      'destiny_account',
      reverse && type == 'credit' ? originAccount : beneficiaryAccount,
    );
    idetail.push({
      key: 'type',
      value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
    });
    return idetail;
  }
  getIsReverse(eventObject) {
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const confirmations = bodyRSresponses.confirmations ?? [];
    const result = confirmations.filter((confirm) =>
      credit_ordinals.includes(confirm.ordinal),
    );
    return result.length === 0 ? false : true;
  }

  findAndReplaceKey(idetail: Array<IDetails>, key: string, value: string) {
    return idetail.find((element, i) => {
      if (element.key == key) {
        idetail[i] = {
          key: key,
          value: value,
        };
        return true;
      }
    });
  }
  creditDetails(eventObject, idetail, type, reverse) {
    const operators = this.getOperators(eventObject, type);
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const confirmations = bodyRSresponses.confirmations;
    const credits = confirmations
      .filter((confirm) => confirm.data.amount > 0)
      .sort((a, b) => (a.ordinal > b.ordinal ? -1 : 0));
    const [first_value] = credits;
    let total_value = first_value ? first_value.data.amount : 0;
    operators.forEach((element) => {
      const [infOperator] = credits.filter(
        (txt) => txt.data.transactionDetails.transactionChannelId === element,
      );
      const amout = infOperator ? infOperator.data.amount : 0;
      total_value = total_value + parseFloat(amout);
    });
    this.findAndReplaceKey(idetail, 'total_value', total_value.toString());

    this.findAndReplaceKey(idetail, 'isreverse', reverse ? 'true' : 'false');
    if (reverse) {
      const originCellphone = this.getCellPhoneOrigin(eventObject);
      this.findAndReplaceKey(idetail, 'destiny_cellphone', originCellphone);
      this.findAndReplaceKey(idetail, 'mesage', 'TRANSACCION EXITOSA');
      this.findAndReplaceKey(idetail, 'status', 'aprobada');
      this.findAndReplaceKey(idetail, 'code', '0');
    }
    this.findAndReplaceKey(
      idetail,
      'value',
      first_value ? first_value.data.amount : 0,
    );
    this.findAndReplaceKey(
      idetail,
      'value_channel',
      first_value
        ? first_value.data.transactionDetails.transactionChannelId
        : '',
    );
    return idetail;
  }
  public doAlgorithm(baseEventLog) {
    return baseEventLog;
  }
}
