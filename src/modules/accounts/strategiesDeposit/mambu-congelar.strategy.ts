import { clientStateEnum } from '../../../shared/enums/crm-enum';
import { StrategyInterface } from './strategy.interface';
import { MambuService } from '../../../providers/mambu/mambu.service';
import { Logger } from '@dale/logger-nestjs';
import { DepositResponseCRM } from '../../../providers/crm/dto/actualizar/crmActualResponse.dto';

export class MambuCongelarStrategy implements StrategyInterface {
  constructor(
    private readonly mambuService: MambuService,
    private logger: Logger,
  ) {}

  async changeOfDepositStatus(parasms: DepositResponseCRM): Promise<any> {
    try {
      //Bloquear Deposito Mambu
      const respCongelar = await this.mambuService.actualizarDepositoMAMBU(
        parasms.items[0].dl_Contacto_Id_c,
        clientStateEnum.BLOQUEADO,
      );
      this.logger.log(`Response bloqued deposit MAMBU`, respCongelar);
      return respCongelar;
    } catch (error) {
      throw new Error('Method not implemented');
    }
  }
}
