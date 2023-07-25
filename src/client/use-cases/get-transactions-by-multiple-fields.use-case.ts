import { Logger } from '@dale/logger-nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';

import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { PtsConnector } from '@dale/pts-connector/service/pts-connector';
import {
  IFilterCriteriaFindTransactions,
  ITransaction,
} from '../common/interfaces';

@Injectable()
export class GetTransactionByMultipleFieldsUseCase {
  constructor(
    @Inject(PtsConnector)
    private readonly transactionConnector: PtsConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(
    fields: IFilterCriteriaFindTransactions,
    page: number,
  ): Promise<ITransaction[]> {
    try {
      const response = await this.transactionConnector.findTransactions(
        fields,
        page,
      );
      if (response.messageRS.length === 0) {
        throw new NotFoundException(
          ErrorCodesEnum.BOS022,
          'No se han encontrado transacciones',
        );
      }
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
