import { ApiProperty } from '@nestjs/swagger';
import { IClient } from '../../common/interfaces';

export class BasicClientDto {
  @ApiProperty({
    example: '8a44cbdc863b1bea01863b74159305f7',
    description: 'Client mambu encodeKey',
  })
  clientId?: string;

  @ApiProperty({
    example: '2000004',
    description: 'Client mambu account id',
  })
  depositNumber?: string;

  @ApiProperty({
    example: 'Jane_Jast@testmail.com',
    description: 'Client Email',
  })
  email?: string;

  @ApiProperty({
    example: 'Jane',
    description: 'Client first name',
  })
  firstName?: string;

  @ApiProperty({
    example: 'Jest',
    description: 'Client last name',
  })
  lastName?: string;

  @ApiProperty({
    example: '3216545987',
    description: 'Client mobile phone number',
  })
  phoneNumber?: string;

  @ApiProperty({
    example: '28521324',
    description: 'Client identification document number',
  })
  identificationNumber?: string;

  @ApiProperty({
    example: 'Cédula de Ciudadanía',
    description: 'Client identification document type',
  })
  identificationType?: string;

  @ApiProperty({
    example: 'ordinario',
    description: 'CRM client enrollment typeAL1pe',
  })
  enrollment?: string;
}

export class GetClientDto implements IClient {
  client: BasicClientDto;
  encodeKey: string;
}
