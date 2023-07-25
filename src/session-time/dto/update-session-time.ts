import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, IsString } from 'class-validator';

export class UpdateSessionTimeDto {
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'Session time id',
  })
  id: string;
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    minimum: 0,
    type: Number,
    required: true,
    description: 'Session time',
  })
  sessionTime: number;
}
