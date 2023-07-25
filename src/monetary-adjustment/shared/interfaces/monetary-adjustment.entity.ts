import { MonetaryAdjustmentInterface } from './monetary-adjustment.interface';
import { TransactionType } from '../enums/adjustment-type.enum';
import { AdjustmentState } from '../enums/adjustment-state.enum';
import { ApiProperty } from '@nestjs/swagger';
import { AdjustmentReason } from '../enums/adjustment-reason.enum';

export class MonetaryAdjustmentEntity implements MonetaryAdjustmentInterface {
  @ApiProperty({
    example: '033613a6-e4b4-4733-97b2-025e8f8df7b6',
    description: 'Unique id of the adjustment',
  })
  id?: string;
  @ApiProperty({
    example: '8a44a5648639ac5501863b42c7e246ef',
    description: 'Client mambu encodeKey',
  })
  clientId?: string;
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
  validateAmount?: number;
  @ApiProperty({
    example: 'CREDIT',
    description: 'Adjustment type: CREDIT or DEBIT',
  })
  adjustmentType: TransactionType;
  @ApiProperty({
    example: 'VERIFIED',
    description:
      'Adjustment state, could be empty, VERIFIED, APPROVED or REJECTED',
  })
  adjustmentState?: AdjustmentState;
  @ApiProperty({
    example: 2,
    description:
      'Transaction level 1: created, level 2: verified, level 3: approved',
  })
  transactionLevel?: number;
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
    example: 5000,
    description: 'Transaction adjustment fee',
  })
  fees: number;
  @ApiProperty({
    example: 19000,
    description: 'IVA',
  })
  vat: number;
  @ApiProperty({
    example: 400,
    description: 'Gravamen movimientos financieros',
  })
  gmf: number;
  @ApiProperty({
    example: '2023-02-15T19:44:36.263Z',
    description: 'Adjustment creation date',
  })
  createdAt?: Date;
  @ApiProperty({
    example: '2023-02-15T19:44:36.263Z',
    description: 'Adjustment update date',
  })
  updatedAt?: Date;

  comment?: string | null;

  @ApiProperty({
    example: 'AJUSTE_POR_RECLAMACION',
    description: 'Adjustment reason field.',
  })
  adjustmentReason: AdjustmentReason;

  assignedTo?: string;
}
