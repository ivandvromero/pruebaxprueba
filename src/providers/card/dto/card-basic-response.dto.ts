import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsString } from 'class-validator';

export class Card {
  cardId: number;
  cardType: number;
  cardNumber: string;
  plasticName: string;
  statusId: number;
  cardImage: string;
  productId: string;
  agreementId: number;
  address: string;
  cityName: string;
  departmentDaneCode: string;
  cityDaneCode: string;
}

export class ErrorData {
  @IsString()
  code?: string;

  @IsString()
  title?: string;

  @IsString()
  message?: string;
}

export class GetCardBasicResponse {
  @ValidateNested({ each: true })
  @Type(() => Card)
  @IsOptional()
  data?: Card;

  @ValidateNested({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ErrorData)
  @IsOptional()
  error?: ErrorData;
}
