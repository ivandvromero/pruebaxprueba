import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { MonetaryAdjustmentInterface } from '../../../shared/interfaces/monetary-adjustment.interface';
import { AdjustmentReason } from '../../../shared/enums/adjustment-reason.enum';
import { TransactionType } from '../../../shared/enums/adjustment-type.enum';
import { Sanitize } from '../../..//shared/common/validator-constrain';
import { UpdateAdjustmentRegister } from '@dale/monetary-adjustment/repositories/activity-update/update-adjustment-register.entity';
export class MassiveMonetaryAdjustmentDto
  implements MonetaryAdjustmentInterface
{
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Adjustment date',
    description: '22072022',
  })
  date: string;
  @IsString()
  @ApiProperty({
    example: 'Adjustment date',
    description: '22072022',
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
  @IsString()
  @IsNotEmpty()
  @Validate(Sanitize)
  @ApiProperty({
    example: 'Crédito',
    description: 'Adjustment type: Crédito or Dédito',
  })
  adjustmentType: TransactionType;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'COU0004',
    description: 'Transaction channel',
  })
  transactionCode: string;
  @IsString()
  @IsNotEmpty()
  transactionDescription: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    example: 5000,
    description: 'Transaction adjustment fee',
  })
  fees: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    example: 19000,
    description: 'IVA',
  })
  vat: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @ApiProperty({
    example: 400,
    description: 'Lien financial movements',
  })
  gmf: number;

  @IsString()
  @Validate(Sanitize)
  @IsNotEmpty()
  @ApiProperty({
    example: 'Ajuste de tope sedpe',
    description: 'description of why the adjustment',
  })
  adjustmentReason: AdjustmentReason;

  @IsString()
  @IsNotEmpty()
  responsible: string;

  updateRegister?: UpdateAdjustmentRegister;
}
