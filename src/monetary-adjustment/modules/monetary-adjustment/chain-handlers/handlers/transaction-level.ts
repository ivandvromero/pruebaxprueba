import { Injectable } from '@nestjs/common';
import { AbstractHandler } from '../abstract-handler';
import { MonetaryAdjustmentRepository } from '../../../../repositories/monetary-adjustment/monetary-adjustment.repository';
import { levels } from '../levels';
import { Logger } from '@dale/logger-nestjs';
import { ResponseInterface } from 'src/monetary-adjustment/shared/interfaces/response-interface';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { FindNextUserSingleMonetaryAdjustmentService } from '../../service/find-next-user-single-monetary-adjustment.service';

@Injectable()
export class TransactionLevel extends AbstractHandler {
  constructor(
    private readonly monetaryAdjustmentRepository: MonetaryAdjustmentRepository,
    private readonly findNextUserService: FindNextUserSingleMonetaryAdjustmentService,
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
      const adjustment =
        await this.monetaryAdjustmentRepository.findAdjustmentById(
          adjustmentId,
        );
      const { transactionCode } = adjustment;
      const assignedTo = await this.findNextUserService.run(
        transactionCode,
        nextLevel,
      );
      await this.monetaryAdjustmentRepository.patchTransactionLevel(
        adjustmentId,
        nextLevel,
        adjustmentMetadata,
        assignedTo,
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
