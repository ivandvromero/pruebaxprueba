import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({
    description: 'User Id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Favorite alias',
  })
  @Length(1, 50, { message: 'Alias must be a 1 character' })
  @IsString()
  favoriteAlias: string;

  @IsString()
  @ApiProperty({
    description: 'Phone Number',
  })
  @ValidateIf((item) => item.phoneNumber == undefined)
  @IsDefined()
  @Matches(/\d/)
  @Length(10, 10, { message: 'Phone number must be a 10 character' })
  phoneNumber: string;

  @ApiProperty({
    description: 'Documento cliente origen',
  })
  @IsString()
  @IsDefined()
  clientId: string;

  @ApiProperty({
    description: 'Tipo de documento',
  })
  @IsString()
  @IsDefined()
  clientIdType: string;

  @ApiProperty({
    description: 'Telefono cliente origen',
  })
  @IsString()
  @IsDefined()
  originCellphone: string;
}
export class ResultFavorite {
  code: string;
  message: string;
  action: string;
}
