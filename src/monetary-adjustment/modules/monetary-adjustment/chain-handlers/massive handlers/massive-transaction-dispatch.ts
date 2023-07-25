import { Injectable } from '@nestjs/common';
import { TransactionService } from '@dale/client/modules/services/transaction.service';
import { Logger } from '@dale/logger-nestjs';
import { ResponseInterface } from '../../../../shared/interfaces/response-interface';
import { AdjustmentState } from '../../../../shared/enums/adjustment-state.enum';
import { AbstractHandler } from '../abstract-handler';
import { levels } from '../levels';
import { TransactionMapper } from '../../../../shared/common/transaction-mapper';
import { MassiveMonetaryAdjustmentFileRepository } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.repository';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { TransactionPts } from '@dale/pts-connector/interfaces/transaction-pts-interface';

@Injectable()
export class MassiveTransactionDispatch extends AbstractHandler {
  monetaryAdjustmentRepository: any;
  constructor(
    private readonly transactionService: TransactionService,
    private readonly repository: MassiveMonetaryAdjustmentFileRepository,
    private readonly logger: Logger,
  ) {
    super();
  }

  public async handle(
    fileAdjustmentsId: string,
    transactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<ResponseInterface> {
    const file = await this.repository.getOneMassive(fileAdjustmentsId, true);

    const { adjustmentState, adjustments } = file;

    const nextLevel = levels[transactionLevel];
    if (
      nextLevel === null &&
      adjustmentState === AdjustmentState.PENDING &&
      file.transactionLevel === transactionLevel
    ) {
      await this.repository.patchTransactionLevel(
        fileAdjustmentsId,
        nextLevel,
        adjustmentMetadata,
      );

      const resolves: TransactionPts[] = await Promise.all(
        adjustments.map(async (adjustment) => {
          try {
            return await this.transactionService.sendTransaction(
              new TransactionMapper(adjustment),
            );
          } catch (error) {
            return error;
          }
        }),
      );

      this.logger.log('Connection with PTS');

      const { hasError, notAccepted } =
        await this.repository.updateSingleAdjustmentsFromFile(
          resolves,
          adjustments,
        );

      if (hasError) {
        await this.repository.patchAdjustmentState(
          fileAdjustmentsId,
          AdjustmentState.FAILED,
          adjustmentMetadata,
          '',
          hasError,
        );
        return {
          result: false,
          nextLevel,
          status: AdjustmentState.FAILED,
        };
      }
      if (notAccepted) {
        await this.repository.patchAdjustmentState(
          fileAdjustmentsId,
          AdjustmentState.ACCEPTED_WITH_ERROR,
          adjustmentMetadata,
        );
        return {
          result: true,
          nextLevel,
          status: AdjustmentState.ACCEPTED_WITH_ERROR,
        };
      }
      await this.repository.patchAdjustmentState(
        fileAdjustmentsId,
        AdjustmentState.ACCEPTED,
        adjustmentMetadata,
      );
      return {
        result: true,
        nextLevel,
        status: AdjustmentState.ACCEPTED,
      };
    }

    return super.handle(
      fileAdjustmentsId,
      transactionLevel,
      adjustmentMetadata,
    );
  }
}
