import { Injectable } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { AbstractHandler } from '../abstract-handler';
import { MassiveMonetaryAdjustmentFileRepository } from '../../../../repositories/file-monetary-adjustment/massive-monetary-adjustment-file.repository';
import { levels } from '../levels';
import { ResponseInterface } from '../../../../shared/interfaces/response-interface';
import { AdjustmentState } from '../../../../shared/enums/adjustment-state.enum';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';

@Injectable()
export class MassiveTransactionLevel extends AbstractHandler {
  constructor(
    private readonly massiveMonetaryAdjustmentFileRepository: MassiveMonetaryAdjustmentFileRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async handle(
    adjustmentId: string,
    transactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<ResponseInterface | null> {
    const nextLevel = levels[transactionLevel];

    if (nextLevel) {
      await this.massiveMonetaryAdjustmentFileRepository.patchTransactionLevel(
        adjustmentId,
        nextLevel,
        adjustmentMetadata,
      );
      const file =
        await this.massiveMonetaryAdjustmentFileRepository.getOneMassive(
          adjustmentId,
          true,
        );

      await Promise.all(
        file.adjustments.map(async (adjustment) => {
          await this.massiveMonetaryAdjustmentFileRepository.patchSingleAdjustment(
            adjustment.id,
            null,
            nextLevel,
            AdjustmentState.PENDING,
          );
        }),
      );

      this.logger.debug('Monetary adjustment successfully updated');
      return {
        result: true,
        nextLevel: nextLevel,
      };
    }

    return super.handle(adjustmentId, transactionLevel, adjustmentMetadata);
  }
}
