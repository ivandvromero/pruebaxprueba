import {
  GetTransactionByMultipleFieldsUseCase,
  SendTransactionUseCase,
} from '../../use-cases';
import { Injectable } from '@nestjs/common';

import { TransactionQuery } from '../dto';

import { TransactionPts } from '@dale/pts-connector/interfaces/transaction-pts-interface';
import { CreateTransactionPtsDto } from '@dale/pts-connector/dto/create-transaction-pts.dto';
import { IFindTransactionPtsResponse } from '@dale/pts-connector/interfaces/find-transactions-pts-response.interface';
import { GetPaginationTransaction } from '../dto/get-pagination-transaction.dto';
import { PaginationNewTransactionResponse } from '@dale/client/common/interfaces/get-transactions-response';
import { ITransaction } from '@dale/client/common/interfaces';

@Injectable()
export class TransactionService {
  constructor(
    private readonly sendTransactionUseCase: SendTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionByMultipleFieldsUseCase,
  ) {}

  async sendTransaction(
    createTransactionDto: CreateTransactionPtsDto,
  ): Promise<TransactionPts> {
    return this.sendTransactionUseCase.apply(createTransactionDto);
  }

  async getTransactionsHandler(
    transactionQuery: TransactionQuery,
    paginationTransaction: GetPaginationTransaction,
  ): Promise<PaginationNewTransactionResponse> {
    const {
      depositNumber,
      identification,
      receivingAccountId,
      originAccountId,
      phone,
      transactionType,
      idTransactionNumber,
      initialDate,
      endDate,
      amount,
      status,
      reason,
    } = transactionQuery;
    const { offset = 0, page, limit = 8 } = paginationTransaction;
    const filterData: any = await this.getTransactionUseCase.apply(
      {
        depositNumber,
        identification,
        receivingAccountId,
        originAccountId,
        phone,
        transactionType,
        idTransactionNumber,
        initialDate,
        endDate,
        amount,
        status,
        reason,
      },
      page,
    );
    const lenght = filterData.messageRS.length;
    const responseMapped = this.mapTransactionData(filterData?.messageRS);
    const paginationResponse = new PaginationNewTransactionResponse(
      responseMapped,
      limit,
      offset,
      lenght,
      page,
    );
    return paginationResponse;
  }
  mapTransactionData(
    transactions: IFindTransactionPtsResponse[],
  ): ITransaction[] {
    if (!Array.isArray(transactions)) {
      return [];
    }
    return transactions.map((transaction: IFindTransactionPtsResponse) => {
      const amounts = Array.isArray(transaction?.amounts)
        ? transaction?.amounts
        : [];
      const fees =
        amounts?.find((data) => data.operation === 'OL_FEE_X_TRX')?.amount || 0;
      const vat =
        amounts?.find((data) => data.operation === 'VAT')?.amount || 0;
      const gmf =
        amounts?.find((data) => data.operation === 'GMF')?.amount || 0;

      const {
        identificationNumber: clientIdentificationNumber,
        type: transactionType,
        transactionDateTime: date,
        sourceProduct: originAccountId,
        targetProduct: receivingAccountId,
        status: state,
        referenceNumber: idTransactionNumber,
        transactionAmount: amount,
        total,
        reason,
      } = transaction;

      return {
        clientIdentificationNumber,
        depositNumber: originAccountId.sourceAccount || originAccountId,
        transactionType,
        date,
        originAccountId: originAccountId.sourceAccount || originAccountId,
        receivingAccountId: receivingAccountId.beneficiaryAccount?.toString(),
        state,
        idTransactionNumber,
        amount,
        total: typeof total === 'string' ? 0 : total,
        fees,
        vat,
        gmf,
        reason: state === 'COMPLETED' ? '' : reason || 'Error de Conexión',
        businessName: '',
      };
    });
  }
}
