import { Logger } from '@dale/logger-nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { IClient } from '../common/interfaces';
import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../common/ports/core-query-connector.interface';
import { GetAccountByClientIdUseCase } from './get-account-by-client-id.use-case';
import { NotFoundException } from '@dale/exceptions//custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';

@Injectable()
export class GetClientByIdentificationNumberUseCase {
  constructor(
    @Inject(CoreQueryConnector)
    private readonly coreConnector: ICoreQueryConnector,
    private readonly getAccountByClientIdUseCase: GetAccountByClientIdUseCase,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(identification: string): Promise<IClient> {
    try {
      const { client } =
        await this.coreConnector.getClientByIdentificationNumber(
          identification,
        );
      const account = await this.getAccountByClientIdUseCase.apply(
        client.clientId,
      );
      client.depositNumber = account.id;
      return {
        client,
        encodeKey: account.encodeKey,
      };
    } catch (error) {
      this.logger.debug(error);
      throw new NotFoundException(
        ErrorCodesEnum.BOS022,
        'La cuenta o cliente no han sido encontrado',
      );
    }
  }
}
