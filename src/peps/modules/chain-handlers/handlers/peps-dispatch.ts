import { BadRequestException, Injectable } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { AbstractPepHandler } from '../abstract-handler';
import { PepsRepository } from '../../../repository/peps.repository';
import { IPatchPepDto } from '../../../shared/interfaces/patch-pep-dto.interface';
import { PepStatus } from '../../../shared/enums/pep-status.enum';
import { pepsLevels } from '../../../shared/constants/levels';

@Injectable()
export class PepsDispatch extends AbstractPepHandler {
  constructor(
    private readonly repository: PepsRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async handle(payload: IPatchPepDto) {
    const nextLevel = pepsLevels[payload.statusLevel || 1];

    if (nextLevel === null) {
      try {
        this.logger.log('Llamada a Onboarding aquí.');

        await this.repository.patchPep({ ...payload, statusLevel: nextLevel });

        return {
          result: true,
          nextLevel: nextLevel,
          identification: payload.identification,
        };
      } catch (error) {
        throw new BadRequestException(
          `Ocurrio un error al hacer al hacer ${
            payload.status === PepStatus.APPROVED
              ? 'la aprobación'
              : 'el rechazo'
          } del PEP con identificación ${payload.identification}`,
        );
      }
    }
    return super.handle(payload);
  }
}
