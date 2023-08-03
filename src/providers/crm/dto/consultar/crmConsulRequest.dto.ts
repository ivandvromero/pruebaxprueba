import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { clientStateEnum } from 'src/shared/enums/crm-enum';

export class ConsultarCRMDTO {
  @IsOptional()
  @IsPhoneNumber('CO')
  @ApiProperty({
    example: '3216545987',
    description: 'Client mobile phone',
    required: false,
  })
  phone?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '2000004',
    description: 'Client deposit number / mambu account id',
    required: false,
  })
  depositNumber?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '22412468',
    description: 'Client identification number',
    required: false,
  })
  identification?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '22412468',
    description: 'Client identification number',
    required: false,
  })
  cambioEstado?: clientStateEnum;
}
