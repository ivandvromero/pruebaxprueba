import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ClientQuery {
  @IsOptional()
  @ApiProperty({
    example: '8a44bcde863b542b01863b5ceb9b0032',
    description: 'Mambu client id or client encodeKey',
    required: false,
  })
  id?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: '123@abc.com',
    description: 'Client email',
    required: false,
  })
  email?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '3216545987',
    description: 'Client mobile phone',
    required: false,
  })
  phone?: string;

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
    example: '2000005',
    description: 'Client deposit number receiving/ mambu account id',
    required: false,
  })
  receivingAccountId?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '2000006',
    description: 'Client deposit number origin/ mambu account id',
    required: false,
  })
  originAccountId?: string;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    example: '22412468',
    description: 'Client identification number',
    required: false,
  })
  identification?: string;
}
