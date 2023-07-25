import { ApiProperty } from '@nestjs/swagger';
import { MonetaryAdjustmentEntityOrm } from '../../repositories/monetary-adjustment/monetary-adjustment.entity';
import { TransactionType } from '../enums/adjustment-type.enum';
import { userLevel } from './user-level';

export class GetAdjustmentsResponse {
  @ApiProperty({
    example: '033613a6-e4b4-4733-97b2-025e8f8df7b6',
    description: 'Unique id of the adjustment',
  })
  id: string;
  @ApiProperty({
    example: '2023-06-09 15:20:21.849',
    description: 'Adjustment creation date',
  })
  createdAt: Date;
  @ApiProperty({
    example: '8a44a5648639ac5501863b42c7e246ef',
    description: 'Client mambu encodeKey',
  })
  clientId: string;
  @ApiProperty({
    example: '000005883546',
    description: 'Electronic deposit associated with the phone number',
  })
  depositNumber: string;
  @ApiProperty({
    example: 100000,
    description: 'Amount to adjust',
  })
  amount: number;
  @ApiProperty({
    example: 'CREDIT',
    description: 'Adjustment type: CREDIT or DEBIT',
  })
  adjustmentType: TransactionType;
  @ApiProperty({
    example: 'COU0004',
    description: 'Transaction channel',
  })
  transactionCode: string;
  @ApiProperty({
    example:
      'Transferencia: INTRASOLUCION- Con Cargo a un Deposito Electrónico por compras establecimientos de Ccio',
    description: 'Transaction channel message',
  })
  transactionDescription: string;
  @ApiProperty({
    example: 'Rejected',
    description: 'Monetary adjustment state',
  })
  adjustmentState: string;
  @ApiProperty({
    example: 'This is a comment',
    description: 'A comment when the adjustment is rejected',
  })
  comment: string;
  @ApiProperty({
    example: 'This is a comment',
    description: 'A comment when the adjustment is rejected',
  })
  verifier: string;
  @ApiProperty({
    example: 'This is a comment',
    description: 'A comment when the adjustment is rejected',
  })
  approver: string;

  constructor(adjustment: MonetaryAdjustmentEntityOrm) {
    const {
      id,
      createdAt,
      clientId,
      depositNumber,
      amount,
      adjustmentType,
      transactionCode,
      transactionDescription,
      adjustmentState,
      comment,
      updateRegister,
    } = adjustment;

    this.id = id;
    this.createdAt = createdAt;
    this.clientId = clientId;
    this.depositNumber = depositNumber;
    this.amount = amount;
    this.adjustmentType = adjustmentType;
    this.transactionCode = transactionCode;
    this.transactionDescription = transactionDescription;
    this.adjustmentState = adjustmentState;
    this.comment = comment ? comment : '';
    this.verifier =
      updateRegister?.user?.length >= 2
        ? updateRegister.user[userLevel['MonetaryAdjustment-Validator']]
        : '';
    this.approver =
      updateRegister?.user?.length >= 3
        ? updateRegister.user[userLevel['MonetaryAdjustment-Approver']]
        : '';
  }
}

export class PaginationAdjustmentsResponse {
  @ApiProperty({
    type: [GetAdjustmentsResponse],
    description: 'Array of adjustments',
  })
  results: GetAdjustmentsResponse[];
  @ApiProperty({
    example: '50',
    description: 'Total of adjustments in database',
  })
  total: number;
  @ApiProperty({
    example: '1',
    description: 'Current page, by default 1',
  })
  current_page: number;
  @ApiProperty({
    example: '10',
    description: 'Quantity of adjustments per page',
  })
  per_page: number;
  @ApiProperty({
    example: '1',
    description: 'Total of pages, starts in 1',
  })
  total_pages: number;

  constructor(
    adjustments: MonetaryAdjustmentEntityOrm[],
    limit: number,
    offset: number,
    count: number,
  ) {
    this.results = adjustments.map(
      (adjustment) => new GetAdjustmentsResponse(adjustment),
    );
    this.total = count;
    this.current_page = offset + 1;
    this.per_page = limit === 0 ? count : limit;
    this.total_pages = limit === 0 ? 1 : Math.ceil(count / limit);
  }
}
