import { BadRequestException, Injectable } from '@nestjs/common';
import { IPepsValidationsDto } from '../../shared/interfaces/peps-validations-dto.interface';
import { PepStatus } from '../../shared/enums/pep-status.enum';
import { PepsRepository } from '../../repository/peps.repository';
import { IPatchPepDto } from '../../shared/interfaces/patch-pep-dto.interface';
import { pepsLevels } from '../../shared/constants/levels';
import { PepsLevel } from '../chain-handlers/handlers/peps-level';
import { PepsDispatch } from '../chain-handlers/handlers/peps-dispatch';

@Injectable()
export class PepsValidationsService {
  constructor(
    private readonly repository: PepsRepository,
    private readonly pepLevels: PepsLevel,
    private readonly pepsDispatch: PepsDispatch,
  ) {}

  async run(payload: IPepsValidationsDto) {
    const nextLevel = pepsLevels[payload.statusLevel];
    const pep = await this.repository.findByIdentification(
      payload.identification,
    );
    const messageError = 'No puedes realizar esta acción.';

    if (pep) {
      switch (true) {
        case payload.statusLevel === 1:
        case pep.status == PepStatus.REJECTED && payload.statusLevel >= 1:
        case pep.status !== PepStatus.PENDING && payload.statusLevel > 1:
          throw new BadRequestException(messageError);
      }
    } else if (!pep && payload.statusLevel > 1) {
      throw new BadRequestException(messageError);
    }

    if (payload.status === PepStatus.REJECTED) {
      if (!payload.comment) {
        throw new BadRequestException(
          'La observación es obligatoria si rechazas el PEP.',
        );
      }

      const payloadWithReject: IPatchPepDto = {
        identification: payload.identification,
        statusLevel: nextLevel,
        comment: payload.comment,
        status: payload.status,
        answerDate: new Date(),
        validatorEmail: payload.validatorEmail,
        approverEmail: payload.approverEmail,
        phone: payload.phone,
        email: payload.approverEmail,
      };

      const payloadToCreate = {
        ...payloadWithReject,
        date: payload.date,
        name: payload.name,
        status: PepStatus.REJECTED,
      };

      return pep
        ? this.repository.patchPep(payloadWithReject)
        : this.repository.create({
            ...payloadToCreate,
            statusLevel: 1,
          });
    }

    const pepLevelResp = await this.pepLevels.handle({
      ...payload,
      isCreated: pep ? true : false,
    });
    const pepDispatchResp = await this.pepsDispatch.handle({
      ...payload,
      answerDate: new Date(),
    });

    return pepLevelResp ? pepLevelResp : pepDispatchResp;
  }
}
