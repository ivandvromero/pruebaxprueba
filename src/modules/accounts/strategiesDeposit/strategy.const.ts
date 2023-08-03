import { PtsService } from 'src/providers/pts/pts.service';
import { MambuBloquearStrategy } from './mambu-bloquear.strategy';
import { MambuCongelarStrategy } from './mambu-congelar.strategy';
import { PTSCancelarStrategy } from './pts-cancelar.strategy';
import { PTSEmbargadoStrategy } from './pts-embargado.strategy';
import { Logger } from '@dale/logger-nestjs';
import { MambuService } from '../../../providers/mambu/mambu.service';

export class NormaStrategy {
  constructor(
    private readonly ptsService: PtsService,
    private logger: Logger,
    private readonly mambuService: MambuService,
  ) {}
  valoreStrategy = {
    mambuBloquear: new MambuBloquearStrategy(this.mambuService, this.logger),
    mambuCongelar: new MambuCongelarStrategy(this.mambuService, this.logger),
    ptsEmbargar: new PTSEmbargadoStrategy(this.ptsService, this.logger),
    ptsCancelar: new PTSCancelarStrategy(this.ptsService, this.logger),
  };
}
