import { nullRemover } from '../../../shared/providers/crm-connector-adapter/helpers/null-remover';
import { Inject, Injectable, Optional } from '@nestjs/common';
import { CRMConnector } from '../../../shared/providers/crm-connector-adapter/crm-connector';
import { NaturalPersonDto } from '../../../shared/providers/crm-connector-adapter/dto/natural-person.dto';
import { NaturalPersonInterface } from '../../common/interfaces';
import { Logger } from '@dale/logger-nestjs';
import { MambuService } from '@dale/client/modules/services/mambu.service';
import { NotFoundException } from '@dale/exceptions/custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';

@Injectable()
export class GetNaturalPersonUseCaseByParams {
  constructor(
    @Inject(CRMConnector)
    private readonly crmConnector: CRMConnector,
    private readonly mambuService: MambuService,
    @Optional() private logger?: Logger,
  ) {}

  public async apply(param: string): Promise<NaturalPersonInterface> {
    try {
      const naturalPerson = await this.crmConnector.getNaturalPersonByParams(
        param,
      );
      const { PartyId, PersonDEO_dl_numero_identificacion_c } =
        naturalPerson.items[0];

      const now = new Date();
      const monthAgo = new Date();
      monthAgo.setDate(now.getDate() - 30);

      const transactionQueryMonth = {
        identification: PersonDEO_dl_numero_identificacion_c,
        initialDate: now,
        endDate: monthAgo,
      };

      const transactionQuery = {
        identification: PersonDEO_dl_numero_identificacion_c,
      };

      const [card, deposit, totalTransactions, lastMonthTransactions] =
        await Promise.all([
          this.crmConnector.getCards(PartyId.toString()),
          this.crmConnector.getDeposits(
            `?q=dl_Contacto_Id_c='${PartyId.toString()}'`,
          ),
          this.mambuService.getTransactionsCount(transactionQuery),
          this.mambuService.getTransactionsCount(transactionQueryMonth),
        ]);

      let naturalPersonMapped = new NaturalPersonDto(
        naturalPerson.items[0],
        card.items[0],
        deposit.items[0],
        totalTransactions,
        lastMonthTransactions,
      );
      naturalPersonMapped = nullRemover(naturalPersonMapped);
      return naturalPersonMapped;
    } catch (error) {
      this.logger.debug(error);
      throw new NotFoundException(
        ErrorCodesEnum.BOS020,
        'No se ha encontrado el cliente con la información ingresada',
      );
    }
  }
}
