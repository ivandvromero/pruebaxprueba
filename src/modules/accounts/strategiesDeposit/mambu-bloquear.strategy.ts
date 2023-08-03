import { MambuService } from '../../../providers/mambu/mambu.service';
import { StrategyInterface } from './strategy.interface';
import { Logger } from '@dale/logger-nestjs';
import { DepositResponseCRM } from '../../../providers/crm/dto/actualizar/crmActualResponse.dto';
import { clientStateEnum } from '../../../shared/enums/crm-enum';

export class MambuBloquearStrategy implements StrategyInterface {
  constructor(
    private readonly mambuService: MambuService,
    private logger: Logger,
  ) {}
  async changeOfDepositStatus(parasms: DepositResponseCRM): Promise<any> {
    try {
      //Bloquear Deposito Mambu
      const respBloquear = await this.mambuService.actualizarDepositoMAMBU(
        parasms.items[0].dl_Contacto_Id_c,
        clientStateEnum.BLOQUEADO,
      );
      this.logger.log(`Response bloqued deposit MAMBU`, respBloquear);
      return respBloquear;
    } catch (error) {
      throw new Error('Method not implemented');
    }
  }
}
