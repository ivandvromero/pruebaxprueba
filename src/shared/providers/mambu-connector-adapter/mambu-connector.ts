import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseBehavior } from '../../../client/providers/providers/base-behavior';

import { AxiosAdapter } from '../http-adapters/axios-adapter';
import { SearchMambuBodyDto } from './dto/search-mambu-body.dto';
import { mambuEnum } from './dto/mambu-enum';
import {
  IAccount,
  IClient,
  IFilterCriteria,
  ITransaction,
  ITransactionChanel,
  ITransactionResponse,
  IUserBehavior,
} from '../../../client/common/interfaces';
import {
  ClientMambu,
  IAccountMambu,
  ITransactionChanelMambu,
} from './interfaces';

import { endpoints } from './constants/api';
import { accountConfig } from './config/account-config';
import { TransactionMambu } from './interfaces/transaction-mambu';
import { CreateTransactionBodyDto } from './dto/create-transaction-body.dto';
import {
  CreateTransactionDto,
  TransactionType,
  SendTransactionDto,
} from '../../../client/modules/dto';
import { randomUUID } from 'crypto';
import { ICoreQueryConnector } from '@dale/client/common/ports/core-query-connector.interface';
import { ICoreTransactionConnector } from '@dale/client/common/ports/core-transaction-connector.interface';

@Injectable()
export class MambuConnector
  implements ICoreQueryConnector, ICoreTransactionConnector
{
  constructor(
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
  ) {}

  roleBehavior: IUserBehavior = new BaseBehavior();

  private rootPath = this.configService.get('config.mambu.rootPath');
  private headers = {
    'Content-Type': 'application/json',
    Accept: this.configService.get('config.mambu.acceptHeader'),
    apiKey: this.configService.get('config.mambu.apiKey'),
  };

  async getClientById(clientId: string): Promise<IClient> {
    const url = `${this.rootPath}${endpoints.CLIENT}/${clientId}`;
    const clientData = await this.http.get<ClientMambu>(url, this.headers, {
      detailsLevel: 'FULL',
    });
    return this.mapMambuDataToClient(clientData);
  }

  async getClientByIdentificationNumber(
    Identification: string,
  ): Promise<IClient> {
    return this.searchClientByFields([
      {
        field: '_identificationDocument.identificationNumber',
        value: Identification,
      },
    ]);
  }

  async getClientByMultipleFields(fields: IFilterCriteria[]): Promise<IClient> {
    return this.searchClientByFields(fields);
  }

  async getAccountById(accountId: string): Promise<IAccount> {
    const url = `${this.rootPath}/deposits/${accountId}?detailsLevel=FULL`;
    const accountData = await this.http.get<IAccountMambu>(url, this.headers);
    const account: IAccount = {
      id: accountData.id,
      holderId: accountData.accountHolderKey,
      encodeKey: accountData.encodedKey,
      balances: 0,
    };
    return account;
  }

  async getAccountByClientId(clientId: string): Promise<IAccount> {
    const url = `${this.rootPath}${endpoints.DEPOSIT_ACCOUNT}/`;
    const params = {
      detailsLevel: 'FULL',
      accountHolderId: clientId,
      accountHolderType: accountConfig.accountHolderType,
    };
    const accountData: IAccountMambu[] = await this.http.get<IAccountMambu[]>(
      url,
      this.headers,
      params,
    );
    const account: IAccount = {
      id: accountData[0].id,
      holderId: accountData[0].accountHolderKey,
      encodeKey: accountData[0].encodedKey,
      balances: accountData[0].balances.totalBalance,
    };
    return account;
  }

  private async searchClientByFields(fields: IFilterCriteria[]) {
    const url = `${this.rootPath}/clients:search?offset=0&limit=1&paginationDetails=OFF&detailsLevel=FULL`;
    const body = new SearchMambuBodyDto(fields);
    const clientsData = await this.http.post<ClientMambu>(
      url,
      this.headers,
      body,
    );
    return this.mapMambuDataToClient(clientsData[0]);
  }

  private mapMambuDataToClient(clientData: ClientMambu): IClient {
    const {
      encodedKey,
      mobilePhone,
      emailAddress,
      firstName,
      lastName,
      _identificationDocument,
    } = clientData;
    const { identificationNumber, identificationType } =
      _identificationDocument;
    const globalClient: IClient = {
      client: {
        clientId: encodedKey,
        depositNumber: '',
        email: emailAddress,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: mobilePhone,
        identificationNumber: identificationNumber,
        identificationType: identificationType,
      },
      encodeKey: encodedKey,
    };
    return this.roleBehavior.mapClient(globalClient);
  }

  async getTransactionChanels(): Promise<ITransactionChanel[]> {
    const url = `${this.rootPath}/organization/transactionChannels`;
    const chanels = await this.http.get<ITransactionChanelMambu[]>(
      url,
      this.headers,
    );
    return chanels.map((item) => {
      const chanel: ITransactionChanel = {
        id: item.id,
        description: item.name.split(' - ')[1],
      };
      return chanel;
    });
  }

  async sendTransaction(
    createDto: CreateTransactionDto,
  ): Promise<ITransaction> {
    if (createDto.vat && createDto.vat > 0) {
      const ivaDto: SendTransactionDto = {
        depositNumber: createDto.depositNumber,
        amount: createDto.vat,
        transactionType: createDto.transactionType,
        transactionChannel: 'IVA1001',
        externalId: createDto.externalId,
      };
      await this.dispatchTransaction(ivaDto);
    }

    if (createDto.gmf && createDto.gmf > 0) {
      const gmfDto: SendTransactionDto = {
        depositNumber: createDto.depositNumber,
        amount: createDto.gmf,
        transactionType: createDto.transactionType,
        transactionChannel: 'GMF1001A',
        externalId: createDto.externalId,
      };
      await this.dispatchTransaction(gmfDto);
    }

    if (createDto.fees && createDto.fees > 0) {
      const feesDto: SendTransactionDto = {
        depositNumber: createDto.depositNumber,
        amount: createDto.fees,
        transactionType: createDto.transactionType,
        transactionChannel: 'COM0001',
        externalId: createDto.externalId,
      };
      await this.dispatchTransaction(feesDto);
    }

    const mainTransaction = await this.dispatchTransaction(createDto);
    return this.mapMambuDataToTransaction(mainTransaction);
  }

  private async dispatchTransaction(
    dto: SendTransactionDto,
  ): Promise<TransactionMambu> {
    let url = `${this.rootPath}${endpoints.DEPOSIT_ACCOUNT}/${dto.depositNumber}/`;
    let message: string;
    if (dto.transactionType == TransactionType.CREDIT) {
      url = `${url}${endpoints.DEPOSIT_TRANSACTION}`;
      message = this.generateNoteMessage(
        dto.transactionChannel,
        '0',
        dto.depositNumber,
      );
    } else if (dto.transactionType == TransactionType.DEBIT) {
      url = `${url}${endpoints.WITHDRAWAL_TRANSACTION}`;
      message = this.generateNoteMessage(
        dto.transactionChannel,
        dto.depositNumber,
        '0',
      );
    }

    const headers = {
      ...this.headers,
      'Idempotency-Key': randomUUID(),
    };

    const body = new CreateTransactionBodyDto(
      dto.amount,
      dto.transactionChannel,
      dto.externalId,
      message,
    );

    const newTransaction = await this.http.post<TransactionMambu>(
      url,
      headers,
      body,
    );

    return newTransaction;
  }

  async getTransactionByMultipleFields(
    fields: IFilterCriteria[],
  ): Promise<ITransactionResponse> {
    const url = `${this.rootPath}${endpoints.DEPOSIT_ACCOUNT}/transactions:search`;
    const params = {
      detailsLevel: 'FULL',
      paginationDetails: 'ON',
      offset: 0,
      limit: 100,
    };
    const body = new SearchMambuBodyDto(fields);
    const res = await this.http.postMambu(url, this.headers, body, params);
    const { headers, data } = res;
    const response: ITransaction[] = await this.fillTransactionArray(data);

    return { headers, response };
  }

  async fillTransactionArray(transactions: TransactionMambu[]) {
    try {
      const promises = transactions.map((item) =>
        this.mapMambuDataToTransaction(item),
      );
      const mappedTransactions = await Promise.all(promises);
      return mappedTransactions;
    } catch (error) {}
  }

  private async getRelatedTransactions(
    linkedTransactionId: string,
  ): Promise<TransactionMambu[]> {
    const url = `${this.rootPath}${endpoints.DEPOSIT_ACCOUNT}/transactions:search`;
    const params = {
      detailsLevel: 'FULL',
      paginationDetails: 'OFF',
      offset: 0,
      limit: 50,
    };
    const body = new SearchMambuBodyDto([
      {
        field: '_additionalDetails.linkedTransactionId',
        value: linkedTransactionId,
      },
    ]);
    const transactions = [];
    const data = await this.http.post<TransactionMambu[]>(
      url,
      this.headers,
      body,
      params,
    );

    return data ? data : transactions;
  }

  private generateNoteMessage(
    channel: string,
    cuentaOrd: string,
    cuentaBen: string,
  ): string {
    return `Notas a enviar a MAMBU  Canal~${channel}~Cuenta Ord.~${cuentaOrd}~ Cuenta Ben.~${cuentaBen} ~Sujeto ~ORDERER~ Concepto ~PRINCIPAL_AMOUNT~Backoffice_IN-DEV_TranDaleD2_FK-2023`;
  }

  private async mapMambuDataToTransaction(
    mambuTransaction: TransactionMambu,
  ): Promise<ITransaction> {
    let vat = 0;
    let fee = 0;
    let gmf = 0;
    const arrayFromNotes = mambuTransaction.notes
      ? mambuTransaction.notes.split('~')
      : [];
    const account: IAccount = await this.getAccountById(
      mambuTransaction.parentAccountKey,
    );
    const { client }: IClient = await this.getClientById(account.holderId);
    let relatedTransactions;
    if (mambuTransaction._additionalDetails?.linkedTransactionId) {
      relatedTransactions = await this.getRelatedTransactions(
        mambuTransaction._additionalDetails.linkedTransactionId,
      );
    }

    if (relatedTransactions?.length > 1) {
      relatedTransactions.forEach((item) => {
        const channel = item.transactionDetails.transactionChannelId;
        if (channel.includes('IVA')) {
          vat = item.amount;
        }
        if (channel.includes('COM')) {
          fee = item.amount;
        }
        if (channel.includes('GMF')) {
          gmf = item.amount;
        }
      });
    }

    const transaction: ITransaction = {
      id: mambuTransaction.id,
      clientIdentificationNumber: client.identificationNumber,
      depositNumber: account.id,
      transactionType: mambuTransaction.type,
      date: new Date(mambuTransaction.valueDate),
      originAccountId: arrayFromNotes[3] ? arrayFromNotes[3] : '',
      receivingAccountId: arrayFromNotes[5] ? arrayFromNotes[5] : '',
      state: mambuEnum.approved,
      amount: mambuTransaction.amount,
      fees: fee,
      vat: vat,
      gmf: gmf,
      total: mambuTransaction.amount + fee + vat + gmf,
    };
    return transaction;
  }
}
