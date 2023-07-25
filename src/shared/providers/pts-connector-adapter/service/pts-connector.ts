import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FindTransactionsBodyDto } from '../dto/find-transactions-body.dto';
import { IFilterCriteriaFindTransactions } from '@dale/client/common/interfaces';
import { CreateTransactionBodyDto } from '../dto/create-transaction-body.dto';
import { SendTransactionPtsDto } from '../dto/send-transaction-pts.dto';
import { TransactionPts } from '../interfaces/transaction-pts-interface';
import { AxiosAdapter } from '@dale/http-adapters/axios-adapter';
import { PtsTokenManager } from './token-manager.service';
import { TransactionOptions } from '../interfaces/find-transactions-pts-response.interface';

@Injectable()
export class PtsConnector {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
    private readonly ptsTokenManager: PtsTokenManager,
  ) {}

  private rootPath = this.configService.get('config.pts.rootPath');
  private headers = {
    // 'Content-Type': 'application/pts-m1255v1+json',
    'Content-Type': 'application/json',
    pCHANNEL: this.configService.get('config.pts.pchannel'),
  };

  async dispatchTransaction(
    dto: SendTransactionPtsDto,
  ): Promise<TransactionPts> {
    this.ptsTokenManager.getToken();
    const url = `${this.rootPath}/api/v2/own-channels/custom/service/PANEL_ADMINISTRATIVO/execute`;
    const token = await this.ptsTokenManager.getToken();
    const headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
    const body = new CreateTransactionBodyDto(
      dto.depositNumber,
      dto.amount,
      dto.transactionType,
      dto.transactionChannel,
      dto.fees,
      dto.gmf,
      dto.vat,
    );
    const newTransaction = await this.http.post<TransactionPts>(
      url,
      headers,
      body,
    );
    return newTransaction;
  }

  async findTransactions(dto: IFilterCriteriaFindTransactions, page: number) {
    this.ptsTokenManager.getToken();
    const url = `${this.rootPath}/api/v1/own-channels/transactions/query/id/0/list?page=${page}`;
    const token = await this.ptsTokenManager.getToken();
    const headers = {
      ...this.headers,
      Authorization: `Bearer ${token}`,
    };
    const transaction: TransactionOptions = {
      identification: dto.identification,
      depositNumber: dto.depositNumber,
      phone: dto.phone,
      originAccountId: dto.originAccountId,
      receivingAccountId: dto.receivingAccountId,
      amount: dto.amount,
      transactionType: dto.transactionType,
      idTransactionNumber: dto.idTransactionNumber,
      initialDate: dto.initialDate,
      endDate: dto.endDate,
      status: dto.status,
    };

    const body = new FindTransactionsBodyDto(transaction);
    const newTransaction = await this.http.post<any>(url, headers, body);
    return newTransaction;
  }
}
