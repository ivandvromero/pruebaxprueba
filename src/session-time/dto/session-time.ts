import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsPositive, IsString } from 'class-validator';

export class SessionTimeDto {
  @IsPositive()
  @Type(() => Number)
  @ApiProperty({
    minimum: 0,
    type: Number,
    required: true,
    description: 'Session time',
  })
  sessionTime: number;
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    description: 'BackOffice role',
  })
  role: string;
}
