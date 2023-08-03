import { PtsService } from 'src/providers/pts/pts.service';
import { StrategyInterface } from './strategy.interface';
import { Logger } from '@dale/logger-nestjs';
import { DepositResponseCRM } from '../../../providers/crm/dto/actualizar/crmActualResponse.dto';
import { clientStateEnum } from '../../../shared/enums/crm-enum';

export class PTSCancelarStrategy implements StrategyInterface {
  constructor(
    private readonly ptsService: PtsService,
    private logger: Logger,
  ) {}
  async changeOfDepositStatus(params: DepositResponseCRM): Promise<any> {
    try {
      //Congelar Deposito PTS
      const respCongelado = await this.ptsService.actualizarDepositoPTS(
        params.items[0].dl_Contacto_Id_c,
        clientStateEnum.CONGELADO,
      );
      this.logger.log(`Response congelar deposit PTS`, respCongelado);
      return respCongelado;
    } catch (error) {
      throw new Error('Method not implemented');
    }
  }
}
