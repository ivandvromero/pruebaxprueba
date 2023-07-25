import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class NaturalPersonQuery {
  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '2000004',
    description: 'Client deposit number / mambu account id',
    required: false,
  })
  depositNumber?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '1000123456',
    description: 'Client identification',
    required: false,
  })
  identification?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '3216545987',
    description: 'Client mobile phone',
    required: false,
  })
  phone?: string;
}
