import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MonetaryAdjustmentInterface } from '../../../shared/interfaces/monetary-adjustment.interface';
import { TransactionType } from '../../../shared/enums/adjustment-type.enum';
import { AdjustmentState } from '../../../shared/enums/adjustment-state.enum';
import { TransactionLevel } from '../../../shared/enums/transaction-level.enum';
import { AdjustmentReason } from '../../../shared/enums/adjustment-reason.enum';

export class MonetaryAdjustmentDto implements MonetaryAdjustmentInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '1a45a5648639ac5501863b42c7e245tf',
    description: 'monetary adjustment id',
  })
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '8a44a5648639ac5501863b42c7e246ef',
    description: 'Client mambu encodeKey',
  })
  clientId?: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '000005883546',
    description: 'Electronic deposit associated with the phone number',
  })
  depositNumber: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Amount to adjust should be a positive number with maximum 2 decimal places',
    },
  )
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    example: 100000.1,
    description: 'Amount to adjust',
  })
  amount: number;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Validate amount should be a positive number with maximum 2 decimal places',
    },
  )
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    example: 100000.1,
    description: 'Amount to verify adjust',
  })
  validateAmount: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TransactionType.CREDIT, TransactionType.DEBIT])
  @ApiProperty({
    example: 'CREDIT',
    description: 'Adjustment type: CREDIT or DEBIT',
  })
  adjustmentType: TransactionType;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    AdjustmentState.ACCEPTED,
    AdjustmentState.REJECTED,
    AdjustmentState.FAILED,
    AdjustmentState.PENDING,
  ])
  @IsOptional()
  adjustmentState?: AdjustmentState;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  @IsIn([TransactionLevel.UNO, TransactionLevel.DOS, TransactionLevel.TRES])
  transactionLevel?: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'COU0004',
    description: 'Transaction channel',
  })
  transactionCode: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example:
      'Transferencia: INTRASOLUCION- Con Cargo a un Deposito Electrónico por compras establecimientos de Ccio',
    description: 'Message of the transaction channel',
  })
  transactionDescription: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    example: 5000,
    description: 'Transaction adjustment fee',
  })
  fees: number; //commission

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    example: 19000,
    description: 'IVA',
  })
  vat: number; //iva

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    example: 400,
    description: 'Gravamen movimientos financieros',
  })
  gmf: number;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  updatedAt?: Date;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([
    AdjustmentReason.AJUSTE_POR_CONCILIACION,
    AdjustmentReason.AJUSTE_POR_RECLAMACION,
  ])
  @ApiProperty({
    example: 'AJUSTE_POR_RECLAMACION',
    description: 'Adjustment reason field.',
  })
  adjustmentReason: AdjustmentReason;
}
