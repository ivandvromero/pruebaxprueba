import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsPositive, Min } from 'class-validator';

export class GetAdjustmentQueryReportsDto {
  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'Transaction code',
  })
  transactionCode?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
    required: false,
    description: 'CREDIT or DEBIT adjustment',
  })
  adjustmentType?: string;

  @IsOptional()
  @ApiProperty({
    type: Boolean,
    required: false,
    description: 'Is the adjustment loaded from file?',
  })
  fromFile?: boolean;

  @IsOptional()
  @ApiProperty({
    minimum: 0,
    type: Number,
    default: 8,
    required: false,
    description: 'Maximum number of adjustments',
  })
  depositNumber?: string;

  @IsDateString()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'Iso string initial date to search',
  })
  initialDate?: Date;

  @IsDateString()
  @ApiProperty({
    type: Date,
    required: true,
    description: 'Iso string end date to search',
  })
  endDate?: Date;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    minimum: 0,
    type: Number,
    default: 8,
    required: false,
    description: 'Maximum number of adjustments',
  })
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({
    minimum: 0,
    type: Number,
    default: 0,
    required: false,
    description: 'Offset of adjustments',
  })
  offset?: number;
}
