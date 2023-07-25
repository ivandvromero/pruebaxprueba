import { Injectable } from '@nestjs/common';
import { PepsRepository } from '../../../repository/peps.repository';
import { Logger } from '@dale/logger-nestjs';
import { AbstractPepHandler } from '../abstract-handler';
import { IPepsValidationsDto } from '../../../shared/interfaces/peps-validations-dto.interface';
import { pepsLevels } from '../../../shared/constants/levels';
import { IPatchPepDto } from '../../../shared/interfaces/patch-pep-dto.interface';

@Injectable()
export class PepsLevel extends AbstractPepHandler {
  constructor(
    private readonly repository: PepsRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async handle(payload: IPepsValidationsDto) {
    const nextLevel = pepsLevels[payload.statusLevel || 1];

    if (nextLevel) {
      const payloadToUpdateWithReject: IPatchPepDto = {
        identification: payload.identification,
        statusLevel: nextLevel,
        comment: payload.comment,
        status: payload.status,
        validatorEmail: payload.validatorEmail,
      };

      delete payload.status;

      payload.isCreated
        ? this.repository.patchPep(payloadToUpdateWithReject)
        : this.repository.create({
            ...payload,
            statusLevel: nextLevel,
          });

      this.logger.debug(
        `Pep successfully ${payload.isCreated ? 'updated' : 'created'}`,
      );
      return {
        result: true,
        nextLevel,
      };
    }

    return super.handle(payload);
  }
}
