import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  GetCardsByAccountPartyUseCase,
  GetNaturalPersonUseCaseByParams,
} from '../../use-cases/crm';
import {
  IAccount,
  IClient,
  IFilterCriteria,
  ITransactionChanel,
} from '../../common/interfaces';

import {
  GetClientByDepositNumberUseCase,
  GetClientByIdUseCase,
  GetClientByMultipleFieldsUseCase,
  GetTransactionChanelsUseCase,
  GetAccountByIdentificationNumberUseCase,
} from '../../use-cases';
import { ClientQuery } from '../dto/client-query.dto';
import { GetTransactionChannelDto } from '../dto/get-transaction-chanel.dto';
import { NaturalPersonQuery } from '../dto/natural-person-query.dto';
import { CardDto } from '../../../shared/providers/crm-connector-adapter/dto/cards.dto';
import { NaturalPersonDto } from '../../../shared/providers/crm-connector-adapter/dto/natural-person.dto';
import { GetDepositByDepositNumber } from '@dale/client/use-cases/crm/get-deposits-by-deposit-number.use-case';
import { GetClientEnrollmentUseCase } from '@dale/client/use-cases/crm/get-client-enrollment.use-case';

@Injectable()
export class ClientService {
  constructor(
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    private readonly getClientByMultipleFieldsUseCase: GetClientByMultipleFieldsUseCase,
    private readonly getTransactionChanelsUseCase: GetTransactionChanelsUseCase,
    private readonly getClientByDepositNumberUseCase: GetClientByDepositNumberUseCase,
    private readonly getNaturalPersonUseCaseByParams: GetNaturalPersonUseCaseByParams,
    private readonly getCardsByAccountPartyUseCase: GetCardsByAccountPartyUseCase,
    private readonly getDepositByDepositNumber: GetDepositByDepositNumber,
    private readonly getAccountByIdentificationNumberUseCase: GetAccountByIdentificationNumberUseCase,
    private readonly getClientEnrollmentUseCase: GetClientEnrollmentUseCase,
  ) {}

  async getClientHandler(clientQuery: ClientQuery): Promise<IClient> {
    const {
      id,
      email,
      phone,
      depositNumber,
      identification,
      originAccountId,
      receivingAccountId,
    } = clientQuery;
    let body: IFilterCriteria[];
    const valueToSend = depositNumber || originAccountId || receivingAccountId;
    body = phone ? [{ field: 'mobilePhoneNumber', value: phone }] : body;
    body = email ? [{ field: 'emailAddress', value: email }] : body;
    body = identification
      ? [
          {
            field: '_identificationDocument.identificationNumber',
            value: identification,
          },
        ]
      : body;
    let resp;
    if (id) {
      resp = await this.getClientByIdUseCase.apply(id);
    }
    if (valueToSend) {
      resp = await this.getClientByDepositNumberUseCase.apply(valueToSend);
    }
    if (!id && !valueToSend) {
      resp = await this.getClientByMultipleFieldsUseCase.apply(body);
    }
    return resp;
  }

  async getClientWithEnrollment(clientQuery: ClientQuery): Promise<IClient> {
    const resp = await this.getClientHandler(clientQuery);
    const { identificationNumber } = resp.client;
    const param = `?q=PersonDEO_dl_numero_identificacion_c='${identificationNumber}'`;
    resp.client.enrollment = await this.getClientEnrollmentUseCase.apply(param);
    return resp;
  }

  async getTransactionChanels(): Promise<GetTransactionChannelDto> {
    const transactionChanels: ITransactionChanel[] =
      await this.getTransactionChanelsUseCase.apply();
    const res: GetTransactionChannelDto = {
      transactionChannel: transactionChanels,
    };
    return res;
  }

  async getNaturalPerson(
    naturalPersonQuery: NaturalPersonQuery,
  ): Promise<NaturalPersonDto> {
    const queryLength = Object.keys(naturalPersonQuery).length;
    if (queryLength === 0 || queryLength > 1) {
      throw new HttpException(
        'Send at least a query param or a maximum of two params',
        HttpStatus.BAD_REQUEST,
      );
    }
    let param;
    const { depositNumber, identification, phone } = naturalPersonQuery;
    if (depositNumber) {
      const resp = await this.getDepositByDepositNumber.apply(
        `?q=dl_NumeroDeDeposito_c='${depositNumber}'`,
      );
      const { dl_Contacto_Id_c } = resp.items[0];
      param = `?q=PartyId='${dl_Contacto_Id_c}'`;
    }
    if (identification) {
      param = `?q=PersonDEO_dl_numero_identificacion_c='${identification}'`;
    }
    if (phone) {
      const formattedNumber = `57-${phone.substring(0, 3)}-${phone.slice(-7)}`;
      param = `?q=RawMobileNumber='${formattedNumber}'`;
    }
    return await this.getNaturalPersonUseCaseByParams.apply(param);
  }

  async getNaturalPersonCards(partyId: string): Promise<CardDto[]> {
    return await this.getCardsByAccountPartyUseCase.apply(partyId);
  }

  async getNaturalPersonBalance(identification: string): Promise<IAccount> {
    const accountResponse =
      await this.getAccountByIdentificationNumberUseCase.apply(identification);
    const { balances } = accountResponse;
    return { balances };
  }
}
