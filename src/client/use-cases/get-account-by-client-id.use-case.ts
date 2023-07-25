import { Logger } from '@dale/logger-nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { IAccount } from '../common/interfaces';

import {
  ICoreQueryConnector,
  CoreQueryConnector,
} from '../common/ports/core-query-connector.interface';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class GetAccountByClientIdUseCase {
  constructor(
    @Inject(CoreQueryConnector)
    private readonly coreConnector: ICoreQueryConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(clientId: string): Promise<IAccount> {
    try {
      return await this.coreConnector.getAccountByClientId(clientId);
    } catch (error) {
      this.logger.debug(error.message);
      throw new NotFoundException(
        ErrorCodesEnum.BOS021,
        `La cuenta para el cliente con id: ${clientId} no ha sido encontrada`,
      );
    }
  }
}
