import { Logger } from '@dale/logger-nestjs';
import { Injectable, Inject, Optional } from '@nestjs/common';

import { CreateTransactionPtsDto } from '../../shared/providers/pts-connector-adapter/dto/create-transaction-pts.dto';
import { TransactionPts } from '../../shared/providers/pts-connector-adapter/interfaces/transaction-pts-interface';
import { PtsConnector } from '@dale/pts-connector/service/pts-connector';

@Injectable()
export class SendTransactionUseCase {
  constructor(
    @Inject(PtsConnector)
    private readonly ptsConnector: PtsConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(
    newTransaction: CreateTransactionPtsDto,
  ): Promise<TransactionPts> {
    try {
      const transaction = await this.ptsConnector.dispatchTransaction(
        newTransaction,
      );
      return transaction;
    } catch (error) {
      this.logger.debug(error);
      throw new Error(error.message);
    }
  }
}
