import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLocateDto {
  @ApiProperty({
    description: 'Clients city',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'Clients departament',
  })
  @IsString()
  departament: string;
}

export class UpdateLocateUserResponse {
  message: string;
}

export class UpdateLocateUserResponseData {
  data: string;
}
