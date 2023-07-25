import { Inject, Injectable, Logger, Optional } from '@nestjs/common';
import { CRMConnector } from '../../../shared/providers/crm-connector-adapter/crm-connector';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { DepositResponseCRMByPartyNumber } from '../../../shared/providers/crm-connector-adapter/interfaces';

@Injectable()
export class GetDepositByDepositNumber {
  constructor(
    @Inject(CRMConnector)
    private readonly crmConnector: CRMConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(param: string): Promise<DepositResponseCRMByPartyNumber> {
    try {
      return await this.crmConnector.getDeposits(param);
    } catch (error) {
      this.logger.debug(error.message);
      throw new NotFoundException(
        ErrorCodesEnum.BOS020,
        'No se ha encontrado el cliente con la información ingresada',
      );
    }
  }
}
