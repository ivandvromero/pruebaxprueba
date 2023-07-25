import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdjustmentValidationsDTO {
  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    example: 'true',
    description: 'Valid approved',
  })
  approved: boolean;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  @ApiProperty({
    example: 'Saldo incorrecto',
    description: 'If approval is rejected, a comment must be added',
  })
  comment?: string;
}
