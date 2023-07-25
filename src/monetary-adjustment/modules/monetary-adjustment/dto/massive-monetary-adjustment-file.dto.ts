import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsPositive,
  IsNumber,
  Min,
  IsArray,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { MassiveMonetaryAdjustmentFileInterface } from '../../../shared/interfaces/massive-monetary-adjustment-file.interface';
import { MassiveMonetaryAdjustmentDto } from './massive-monetary-adjustment.dto';
import { MassiveAdjustmentReason } from '../../../../shared/config/massive-config';

export class MassiveMonetaryAdjustmentFileDto
  implements MassiveMonetaryAdjustmentFileInterface
{
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'aFileNameExample.xlsx',
    description: 'Original sheet file name ',
  })
  fileName: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'd20763f5-6c7f-44b8-940d-89981c631162',
    description: 'Original sheet file name ',
  })
  frontId: string;
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({
    example: 256,
    description: 'Original sheet file size ',
  })
  size: number;

  @Min(0)
  @ApiProperty({
    example: '12000000',
    description: 'Monetary adjustments debit summation',
  })
  @ApiProperty({
    example: '12000000',
    description: 'Monetary adjustments credit summation',
  })
  totalCredit: number;
  @Min(0)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    {
      message:
        'Amount to adjust should be a positive number with maximum 2 decimal places',
    },
  )
  @ApiProperty({
    example: '12000000',
    description: 'Monetary adjustments debit summation',
  })
  totalDebit: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: '10',
    description: 'Adjustments quantity inside the sheet',
  })
  totalRecords: number;

  @IsArray()
  @ArrayMaxSize(MassiveAdjustmentReason)
  @ValidateNested({ each: true })
  @Type(() => MassiveMonetaryAdjustmentDto)
  adjustments: MassiveMonetaryAdjustmentDto[];

  @IsPositive()
  @IsNotEmpty()
  consecutive: number;
}
