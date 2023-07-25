import { Injectable } from '@nestjs/common';
import { TransactionService } from '@dale/client/modules/services/transaction.service';
import { Logger } from '@dale/logger-nestjs';
import { ResponseInterface } from '../../../../shared/interfaces/response-interface';
import { TransactionMapper } from '../../../../shared/common/transaction-mapper';
import { AdjustmentState } from '../../../../shared/enums/adjustment-state.enum';
import { AbstractHandler } from '../abstract-handler';
import { levels } from '../levels';
import { MonetaryAdjustmentRepository } from '../../../../repositories/monetary-adjustment/monetary-adjustment.repository';
import { BadRequestException } from '@dale/exceptions//custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { getPtsErrorMessage } from '@dale/monetary-adjustment/shared/common/get-pts-message-error';
import { PtsTokenManager } from '@dale/pts-connector/service/token-manager.service';

@Injectable()
export class TransactionDispatch extends AbstractHandler {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly monetaryAdjustmentRepository: MonetaryAdjustmentRepository,
    private readonly logger: Logger,
    private readonly ptsTokenManager: PtsTokenManager,
  ) {
    super();
  }

  public async handle(
    adjustmentId: string,
    transactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<ResponseInterface | null> {
    const adjustment =
      await this.monetaryAdjustmentRepository.findAdjustmentById(adjustmentId);

    const { adjustmentState } = adjustment;

    const nextLevel = levels[transactionLevel];
    if (
      nextLevel === null &&
      adjustmentState === AdjustmentState.PENDING &&
      adjustment.transactionLevel === transactionLevel
    ) {
      const transaction = new TransactionMapper(adjustment);
      try {
        await this.transactionService.sendTransaction(transaction);
        this.logger.debug('PTS Call completed successfully');
        await this.monetaryAdjustmentRepository.patchTransactionLevel(
          adjustmentId,
          nextLevel,
          adjustmentMetadata,
        );
        await this.monetaryAdjustmentRepository.patchAdjustmentState(
          adjustmentId,
          AdjustmentState.ACCEPTED,
          adjustmentMetadata,
        );
        return {
          result: true,
          nextLevel: nextLevel,
          id: adjustmentId,
        };
      } catch (error) {
        this.logger.error(error?.message);
        if (error?.message.includes('OAuth')) {
          this.ptsTokenManager.deleteTokenCache();
          throw new BadRequestException(
            ErrorCodesEnum.BOS036,
            'Error de validación del token de PTS, por favor reintente de nuevo.',
          );
        }
        const res = JSON.parse(error?.message);
        if (
          res.statusRS?.description &&
          !error?.message.includes('Digital Service')
        ) {
          throw new BadRequestException(ErrorCodesEnum.BOS006, {
            message: getPtsErrorMessage(await res.statusRS?.description),
            id: adjustmentId,
          });
        }
        throw new BadRequestException(ErrorCodesEnum.BOS006, {
          message: 'Ocurrió un error, reintente mas tarde.',
          id: adjustmentId,
        });
      }
    }
    return super.handle(adjustmentId, transactionLevel, adjustmentMetadata);
  }
}
