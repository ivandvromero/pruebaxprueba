import { Inject, Injectable, Optional } from '@nestjs/common';
import { CRMConnector } from '../../../shared/providers/crm-connector-adapter/crm-connector';
import { Logger } from '@dale/logger-nestjs';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class GetClientEnrollmentUseCase {
  constructor(
    @Inject(CRMConnector)
    private readonly crmConnector: CRMConnector,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(param: string): Promise<string> {
    try {
      const naturalPerson = await this.crmConnector.getNaturalPersonByParams(
        param,
      );
      const { PersonDEO_dl_tipo_enrrolamiento_c } = naturalPerson.items[0];
      return PersonDEO_dl_tipo_enrrolamiento_c;
    } catch (error) {
      this.logger.debug(error);
      throw new NotFoundException(
        ErrorCodesEnum.BOS020,
        'No se ha encontrado el cliente con la información ingresada',
      );
    }
  }
}
