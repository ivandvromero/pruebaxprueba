import { EventLogStrategy } from '../../../providers/context-eventlog/eventlog-strategy.interface';
import { IDetails } from '../../../providers/context-eventlog/dto/event-log.dto';
import { TypeTransactionEventLog } from '../../../config/env/env.config';
import { credit_ordinals } from '../constants/api';

export class IntrasolutionD2D1AndReverseEventLogStrategy
  implements EventLogStrategy
{
  public getCellPhoneOrigin(eventObject) {
    return eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
      /-/g,
      '',
    );
  }
  public getCellPhoneDestiny(eventObject) {
    return this.getCellPhoneOrigin(eventObject);
  }

  public getOperators(eventObject, type) {
    // si continene reverso poner las R a todos
    const reverse = this.getIsReverse(eventObject);
    return reverse && type == 'credit'
      ? ['COM0005R', 'IVA1001R', 'GMF1001R']
      : ['COM0005', 'IVA1001', 'GMF1001'];
  }

  public getAdditionalDetail(eventObject, idetail, type): Array<IDetails> {
    const [beneficiary] = eventObject.RQ.messageRQ.beneficiaries;
    const reverse = this.getIsReverse(eventObject);
    const origin_account =
      eventObject.CFO.orderer.account.othersId.identificationId;
    const beneficiaryAccountType =
      beneficiary.account.othersId.identificationType;
    const beneficiaryAccount = beneficiary.account.othersId.identificationId;
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const confirmations = bodyRSresponses.confirmations;
    const dale1TxId = confirmations.slice(-1)[0].data.transactionId;
    if (type == 'credit') {
      this.creditDetails(eventObject, idetail, type, reverse);
    }
    this.findKey(
      idetail,
      'destiny_account',
      reverse && type == 'credit' ? origin_account : beneficiaryAccount,
    );
    idetail.push(
      {
        key: 'type',
        value: TypeTransactionEventLog[eventObject.RQ.messageRQ.digitalService],
      },
      {
        key: 'destiny_account_type',
        value: reverse && type == 'credit' ? 'DALE' : beneficiaryAccountType,
      },
      {
        key: 'tx_id_dale1',
        value: dale1TxId ? dale1TxId : '',
      },
    );
    return idetail;
  }

  findKey(idetail: Array<IDetails>, key: string, value: string) {
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
  getIsReverse(eventObject) {
    const confirmations = this.getConfirmationEventLog(eventObject);
    const result = confirmations.filter((confirm) =>
      credit_ordinals.includes(confirm.ordinal),
    );
    return result.length === 0 ? false : true;
  }
  getConfirmationEventLog(eventObject) {
    const bodyRSresponses = this.getInfoRS(eventObject);
    return bodyRSresponses.confirmations ?? [];
  }
  getInfoRS(eventObject) {
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    bodyRSresponses.PTSId = bodyRSresponses.PTSId
      ? bodyRSresponses.PTSId.replace(/PI/g, '')
      : '';
    return bodyRSresponses;
  }
  creditDetails(eventObject, idetail, type, reverse) {
    const operator = this.getOperators(eventObject, type);
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const confirmations = bodyRSresponses.confirmations;
    const credits = confirmations
      .filter((confirm) => confirm.data.amount > 0)
      .sort((a, b) => (a.ordinal > b.ordinal ? -1 : 0));
    const [first_value] = credits;
    let total_value = first_value ? first_value.data.amount : 0;
    operator.forEach((obj, i) => {
      const [infOperator] = credits.filter(
        (txt) => txt.data.transactionDetails.transactionChannelId === obj,
      );
      const amout = infOperator ? infOperator.data.amount : 0;
      total_value = total_value + parseFloat(amout);
    });
    this.findKey(idetail, 'total_value', total_value.toString());
    this.findKey(idetail, 'code', '0');

    this.findKey(idetail, 'mesage', 'TRANSACCION EXITOSA');
    this.findKey(idetail, 'isreverse', reverse ? 'true' : 'false');
    this.findKey(idetail, 'status', 'aprobada');
    this.findKey(idetail, 'value', first_value ? first_value.data.amount : 0);
    this.findKey(
      idetail,
      'value_channel',
      first_value
        ? first_value.data.transactionDetails.transactionChannelId
        : '',
    );
    return idetail;
  }
  public doAlgorithm(eventObject) {
    return eventObject;
  }
}
