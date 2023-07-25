import { MonetaryAdjustmentEntityOrm } from '../../repositories/activity-update/update-adjustment-register.entity';
import { ApiProperty } from '@nestjs/swagger';
import { userLevel } from './user-level';
import { AdjustmentState } from '../enums/adjustment-state.enum';

export class GetAdjustmentReportsResponse {
  id: string;
  transactionCode: string;
  transactionDescription: string;
  adjustmentType: string;
  amount: number;
  depositNumber: string;
  capturerUser: string;
  dateCaptured: Date | string;
  verifierUser: string;
  dateVerified: Date | string;
  approverUser: string;
  dateApproved: Date | string;
  adjustmentState: string;
  comment?: string;

  constructor(reports: MonetaryAdjustmentEntityOrm) {
    const {
      id,
      transactionCode,
      transactionDescription,
      adjustmentType,
      amount,
      depositNumber,
      updateRegister,
      adjustmentState,
      comment,
    } = reports;

    const { user = [], updatedAt = [] } = updateRegister || {};

    this.id = id;
    this.transactionCode = transactionCode;
    this.transactionDescription = transactionDescription;
    this.adjustmentType = adjustmentType;
    this.amount = amount;
    this.depositNumber = depositNumber;
    this.capturerUser =
      user.length >= 1 ? user[userLevel['MonetaryAdjustment-Capturer']] : '';
    this.dateCaptured =
      updatedAt.length >= 1
        ? updatedAt[userLevel['MonetaryAdjustment-Capturer']]
        : '';
    this.verifierUser =
      user.length >= 2 ? user[userLevel['MonetaryAdjustment-Validator']] : '';
    this.dateVerified =
      updatedAt.length >= 2
        ? updatedAt[userLevel['MonetaryAdjustment-Validator']]
        : '';
    this.approverUser =
      user?.length >= 3 ? user[userLevel['MonetaryAdjustment-Approver']] : '';
    this.dateApproved =
      updatedAt.length >= 3
        ? updatedAt[userLevel['MonetaryAdjustment-Approver']]
        : '';
    this.adjustmentState = adjustmentState;
    this.comment = adjustmentState === AdjustmentState.REJECTED ? comment : '';
  }
}
export class PaginationRegisterAdjustmentsResponse {
  @ApiProperty({
    type: [GetAdjustmentReportsResponse],
    description: 'Array of adjustments',
  })
  results: GetAdjustmentReportsResponse[];
  @ApiProperty({
    example: '50',
    description: 'Total of single adjustments in database',
  })
  total: number;
  @ApiProperty({
    example: '1',
    description: 'Current page default 1',
  })
  current_page: number;
  @ApiProperty({
    example: '10',
    description: 'Quantity of adjustment reports per page',
  })
  per_page: number;
  @ApiProperty({
    example: '1',
    description: 'Total of pages begin in 1',
  })
  total_pages: number;

  constructor(
    adjustments: MonetaryAdjustmentEntityOrm[],
    limit: number,
    offset: number,
    count: number,
  ) {
    this.results = adjustments.map(
      (adjustment) => new GetAdjustmentReportsResponse(adjustment),
    );
    this.total = count;
    this.current_page = offset + 1;
    this.per_page = limit === 0 ? count : limit;
    this.total_pages = limit === 0 ? 1 : Math.ceil(count / limit);
  }
}
