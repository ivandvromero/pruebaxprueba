import { PaginationAdjustmentsResponse } from '@dale/monetary-adjustment/shared/common';
import {
  MonetaryAdjustmentEntity,
  ResponseInterface,
} from '@dale/monetary-adjustment/shared/interfaces';
import {
  MonetaryAdjustmentDto,
  AdjustmentQueryDto,
  PatchTransactionLevelDTO,
  PatchAdjustmentStateDTO,
} from '../dto';

export abstract class MonetaryAdjustmentRepositoryDB {
  abstract createAdjustment(
    monetaryAdjustmentDTO: MonetaryAdjustmentDto,
  ): Promise<MonetaryAdjustmentEntity>;
  abstract findAll(
    req: any,
    adjustmentQueryDto?: AdjustmentQueryDto,
  ): Promise<PaginationAdjustmentsResponse>;
  abstract patchTransactionLevel?(
    adjustmentId: string,
    newTransactionLevel: number | PatchTransactionLevelDTO,
  ): Promise<string>;
  abstract patchAdjustmentState?(
    adjustmentId: string,
    newAdjustmentState: string | PatchAdjustmentStateDTO,
  ): Promise<ResponseInterface | string>;
  abstract findAdjustmentById?(
    adjustmentId: string,
  ): Promise<MonetaryAdjustmentEntity>;
}
