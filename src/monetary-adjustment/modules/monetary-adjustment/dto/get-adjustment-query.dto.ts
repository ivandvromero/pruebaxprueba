import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class AdjustmentQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    minimum: 0,
    type: Number,
    default: 10,
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
  @IsOptional()
  @IsString()
  filename?: string;
}
