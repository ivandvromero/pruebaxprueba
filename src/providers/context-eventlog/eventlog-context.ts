//Libraries
import { Injectable } from '@nestjs/common';

//dto
import { MessageEvent } from '../../dto/content.dto';
import { BaseEventLog, IDetails, IAudit, ISource } from './dto/event-log.dto';

//Strategies
import { EventLogStrategy } from './eventlog-strategy.interface';

//Provider
import { UserService } from '../../providers/user/user.service';
import { ConfigurationService } from '../dale/services/configuration.service';
import {
  event_log_application,
  event_log_channel,
} from './constants/event-log';
//Util
import { getServiceIp } from '../../utils/get-service-ip';
import { getStructure } from '../../providers/context-eventlog/utils/get-structure';

//Constants
import {
  credit_ordinals,
  providerNameADL,
  transactionEventLogTypeStrategies,
} from '../../modules/eventlog/constants/api';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';
import { formatDataCreationDate } from '../../utils/transform-class';

@Injectable()
export class ProviderEventlogContext {
  constructor(
    private readonly userService: UserService,
    private readonly configurationService: ConfigurationService,
  ) {}
  public strategy: EventLogStrategy;
  public strategyConfig;
  setStrategy(transactionType: string): EventLogStrategy {
    this.strategyConfig = transactionEventLogTypeStrategies[transactionType];
    this.strategy = new this.strategyConfig.strategy();
    return this.strategy;
  }

  async generateEventLog(eventObject): Promise<any> {
    const iSource = this.getSource();
    const resultEvent = this.getResult(eventObject);
    const timestamp = this.getTimestamp(eventObject);
    const result = getStructure(this.strategyConfig.typeOperator);
    const resultArray = [];
    for (const key in result) {
      const baseEventLog: BaseEventLog = result[key];
      const iAudit = await this.getAudit(eventObject, baseEventLog.eventCode);
      const type = baseEventLog.eventCode === 100 ? 'debit' : 'credit';
      const reverse = this.getIsReverse(eventObject);
      baseEventLog.audit = iAudit;
      baseEventLog.source = iSource;
      baseEventLog.result = reverse && type === 'credit' ? true : resultEvent;
      baseEventLog.timestamp = timestamp.toString();
      const details = this.getDetailList(eventObject, type);
      baseEventLog.details = details;
      if (
        eventObject.CFO.general.transactionType ==
        'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR'
      ) {
        if ((reverse && type === 'credit') || type === 'debit')
          resultArray.push(baseEventLog);
      } else {
        resultArray.push(baseEventLog);
      }
    }
    return resultArray;
  }

  async getAudit(eventObject, eventCode): Promise<IAudit> {
    const ordererUser = await this.userService.getUser(
      this.getCellPhone(eventObject, eventCode),
    );
    const infoRs = this.getInfoRS(eventObject);
    const infoHead = this.getInfoHeaderRs(eventObject);
    const ip = getServiceIp();
    const [key] = Object.keys(ip);
    const [ipNest] = ip[key];
    const clientIdType = await this.getClientIdType(
      ordererUser.data.documentType,
      providerNameADL,
    );

    const iAudit: IAudit = {
      application: event_log_application,
      clientId: ordererUser.data.documentNumber,
      clientIdType: clientIdType,
      channel: event_log_channel,
      transactionId: infoRs.PTSId,
      requestId: infoHead.msgId,
      ipAddress: ipNest,
      sessionId: '',
    };
    return iAudit;
  }
  getSource() {
    const iSource: ISource = {
      userAgent: '',
    };
    return iSource;
  }
  getResult(eventObject) {
    const infoStatusRs = this.getInfoStatusRs(eventObject);
    return infoStatusRs.code === '0' ? true : false;
  }
  getTimestamp(eventObject) {
    const result = formatDataCreationDate(eventObject);
    return result.data.creationDate;
  }
  getDetailList(eventObject: MessageEvent, type) {
    let idetail: IDetails[] = [];
    const info = this.getInfo(eventObject);
    const isReverse =
      eventObject.CFO.general.transactionType.indexOf('REVERSE');
    idetail.push(
      {
        key: 'code',
        value: info.code,
      },
      {
        key: 'mesage',
        value: info.mesage.replace(/[^a-zA-Z0-9 ]/g, '').trim(),
      },
      {
        key: 'status',
        value: this.getResult(eventObject) ? 'aprobada' : 'rechazada',
      },
      {
        key: 'isreverse',
        value: isReverse == -1 ? 'false' : 'true',
      },
      {
        key: 'origin_cellphone',
        value: info.origin_cellphone.trim(),
      },
      {
        key: 'destiny_cellphone',
        value: info.destiny_cellphone.trim(),
      },
      {
        key: 'origin_account',
        value: info.origin_account.trim(),
      },
      {
        key: 'destiny_account',
        value: info.destiny_account.trim(),
      },
      {
        key: 'value_transacion',
        value: info.value_transacion,
      },
    );
    idetail = this.getConfirmation(eventObject, idetail, type);
    return idetail;
  }
  getConfirmation(eventObject, idetail, type): IDetails[] {
    const operatorPts = this.getCreditDebit(eventObject);
    const operator = this.strategy.getOperators(eventObject, type);
    const [first] = operatorPts[type];
    const [last] = operatorPts[type].slice(-1);
    const rObjValue: IDetails = {
      key: 'value',
      value: first ? first.data.amount.toString() : '0',
    };
    idetail.push(rObjValue);
    const rObjChannel: IDetails = {
      key: 'value_channel',
      value: first
        ? first.data.transactionDetails.transactionChannelId.toString()
        : '',
    };
    idetail.push(rObjChannel);
    let total_value = first ? first.data.amount : 0;

    operator.forEach((obj, i) => {
      const [infOperator] = operatorPts[type].filter(
        (txt) => txt.data.transactionDetails.transactionChannelId === obj,
      );
      const amout = infOperator ? infOperator.data.amount : 0;
      i++;
      const rObjValue: IDetails = {
        key: `valueAddtional${i}`,
        value: amout.toString(),
      };
      idetail.push(rObjValue);
      const rObjChannel: IDetails = {
        key: `valueAddtional${i}_channel`,
        value: obj,
      };
      idetail.push(rObjChannel);
      total_value = total_value + parseFloat(amout);
    });
    idetail.push({
      key: 'total_value',
      value: total_value.toString(),
    });
    idetail.push({
      key: 'balance_final',
      value: last ? last.data.accountBalances.totalBalance.toString() : '0',
    });
    const infoHead = this.getInfoHeaderRs(eventObject);
    const infoRs = this.getInfoRS(eventObject);
    idetail.push(
      {
        key: 'idenfier_transaction_mambu',
        value: first?.data?._additionalDetails?.linkedTransactionId
          ? first.data._additionalDetails.linkedTransactionId
          : infoRs.PTSId,
      },
      {
        key: 'idenfier_transaction_pts',
        value: infoHead.msgId,
      },
      {
        key: 'date_transaction',
        value: first ? first.data.creationDate : '',
      },
    );
    idetail = this.strategy.getAdditionalDetail(eventObject, idetail, type);

    return idetail;
  }
  getInfo(eventObject) {
    const info = {
      value_transacion: '',
      origin_cellphone: '',
      destiny_cellphone: '',
      origin_account: '',
      destiny_account: '',
      code: '',
      mesage: '',
    };
    const infoCFOgeneral = this.getInfoCFOgeneral(eventObject);
    info.value_transacion = infoCFOgeneral.transactionAmount.toString();

    const cellphoneOrder = this.strategy.getCellPhoneOrigin(eventObject);
    info.origin_cellphone = cellphoneOrder;
    const cellphoneBeneficiary = this.strategy.getCellPhoneDestiny(eventObject);
    info.destiny_cellphone = cellphoneBeneficiary;

    const infoOrdererCFO = this.getInfoOrdererCFO(eventObject);
    info.origin_account = infoOrdererCFO;
    const infoBeneficiariesCFO = this.getInfoBeneficiariesCFO(eventObject);
    info.destiny_account = infoBeneficiariesCFO;

    const infoStatusRs = this.getInfoStatusRs(eventObject);
    info.code = infoStatusRs.code;
    info.mesage = infoStatusRs.description;
    return info;
  }
  getInfoCFOgeneral(eventObject) {
    const bodyRSresponses = eventObject.CFO.general;
    return bodyRSresponses;
  }
  getInfoOrdererCFO(eventObject) {
    const origin_account =
      eventObject.CFO.orderer.account.othersId.identificationId;
    return origin_account;
  }
  getInfoBeneficiariesCFO(eventObject) {
    const [bodyRSresponses] = eventObject.CFO.beneficiaries;
    const destiny_account = bodyRSresponses.account.othersId.identificationId;
    return destiny_account;
  }
  getInfoStatusRs(eventObject) {
    const bodyRSresponses = eventObject?.RS?.statusRS;
    return bodyRSresponses;
  }
  getInfoHeaderRs(eventObject) {
    const bodyRSresponses = eventObject?.RS?.headerRS;
    return bodyRSresponses;
  }
  getInfoRS(eventObject) {
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    bodyRSresponses.PTSId = bodyRSresponses.PTSId
      ? bodyRSresponses.PTSId.replace(/PI/g, '')
      : '';
    return bodyRSresponses;
  }
  getCreditDebit(eventObject) {
    const bodyRSresponses = this.getInfoRS(eventObject);
    const confirmations = bodyRSresponses.confirmations ?? [];
    const debit = confirmations
      .filter((confirm) => confirm.data.amount < 0)
      .sort((a, b) => Number(a.data.id) > Number(b.data.id));
    const credit = confirmations
      .filter((confirm) => confirm.data.amount > 0)
      .sort((a, b) => Number(a.data.id) > Number(b.data.id));
    return {
      debit,
      credit,
    };
  }
  getCellPhone(eventObject, eventCode) {
    return eventCode == 100
      ? this.strategy.getCellPhoneOrigin(eventObject)
      : this.strategy.getCellPhoneDestiny(eventObject);
  }
  async getClientIdType(
    documentType: string,
    provider: string,
  ): Promise<string> {
    try {
      const { data } = await this.configurationService.getDocumentTypeById(
        documentType,
      );
      // const translatedDocument = data.provider.find((x) => x.id == provider);
      // return translatedDocument.code;
      return data.shortName;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON026, error);
    }
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
}
