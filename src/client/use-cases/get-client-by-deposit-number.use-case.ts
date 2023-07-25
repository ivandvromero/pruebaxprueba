import { Logger } from '@dale/logger-nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { IAccount, IClient } from '../common/interfaces';
import { GetClientByIdUseCase } from './get-client-by-Id.use-case';

import {
  ICoreQueryConnector,
  CoreQueryConnector,
} from '../common/ports/core-query-connector.interface';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class GetClientByDepositNumberUseCase {
  constructor(
    @Inject(CoreQueryConnector)
    private readonly coreConnector: ICoreQueryConnector,
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(depositNumber: string): Promise<IClient> {
    try {
      const account: IAccount = await this.coreConnector.getAccountById(
        depositNumber,
      );
      const { client } = await this.getClientByIdUseCase.apply(
        account.holderId,
        true,
      );
      client.depositNumber = account.id;
      return {
        client,
        encodeKey: account.encodeKey,
      };
    } catch (error) {
      this.logger.debug(error.message);
      throw new NotFoundException(
        ErrorCodesEnum.BOS021,
        `La cuenta para el cliente con id: ${depositNumber} no ha sido encontrada`,
      );
    }
  }
}
