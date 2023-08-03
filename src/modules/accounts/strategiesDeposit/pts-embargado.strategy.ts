import { PtsService } from 'src/providers/pts/pts.service';
import { StrategyInterface } from './strategy.interface';
import { Logger } from '@dale/logger-nestjs';
import { DepositResponseCRM } from '../../../providers/crm/dto/actualizar/crmActualResponse.dto';
import { clientStateEnum } from '../../../shared/enums/crm-enum';

export class PTSEmbargadoStrategy implements StrategyInterface {
  constructor(
    private readonly ptsService: PtsService,
    private logger: Logger,
  ) {}
  async changeOfDepositStatus(parasms: DepositResponseCRM): Promise<any> {
    try {
      //Embargo Deposito PTS
      const respEmbargo = await this.ptsService.actualizarDepositoPTS(
        parasms.items[0].dl_Contacto_Id_c,
        clientStateEnum.EMBARGADO,
      );
      this.logger.log(`Response embargo deposit PTS`, respEmbargo);
      return respEmbargo;
    } catch (error) {
      throw new Error('Method not implemented');
    }
  }
}
