import { Logger } from '@dale/logger-nestjs';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { ITransactionChanel } from '../common/interfaces';

import {
  CoreQueryConnector,
  ICoreQueryConnector,
} from '../common/ports/core-query-connector.interface';

@Injectable()
export class GetTransactionChanelsUseCase {
  constructor(
    @Inject(CoreQueryConnector)
    private readonly coreConnector: ICoreQueryConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(): Promise<ITransactionChanel[]> {
    try {
      return await this.coreConnector.getTransactionChanels();
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
