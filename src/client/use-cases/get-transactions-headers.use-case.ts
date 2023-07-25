import {
  CoreTransactionConnector,
  ICoreTransactionConnector,
} from '@dale/client/common/ports/core-transaction-connector.interface';
import { Logger } from '@dale/logger-nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { IFilterCriteria, ITransactionResponse } from '../common/interfaces';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class GetTransactionsWithHeadersUseCase {
  constructor(
    @Inject(CoreTransactionConnector)
    private readonly transactionConnector: ICoreTransactionConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(fields: IFilterCriteria[]): Promise<ITransactionResponse> {
    try {
      const response =
        await this.transactionConnector.getTransactionByMultipleFields(fields);
      return response;
    } catch (error) {
      this.logger.debug(error);
      throw new NotFoundException(
        ErrorCodesEnum.BOS022,
        'No se han encontrado transacciones',
      );
    }
  }
}
