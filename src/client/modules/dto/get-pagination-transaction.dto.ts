import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetPaginationTransaction {
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    type: Number,
    default: 8,
    required: false,
    description: 'Maximum number of transactions',
  })
  limit?: number;
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    type: Number,
    default: 0,
    required: false,
    description: 'Offset of transactions',
  })
  offset?: number;
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    type: Number,
    default: 8,
    required: false,
    description: 'Maximum number of transactions',
  })
  page: number;
}
