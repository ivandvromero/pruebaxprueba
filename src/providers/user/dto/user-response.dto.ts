import { Type } from 'class-transformer';
import { ValidateNested, IsOptional, IsString } from 'class-validator';

export class User {
  id: string;

  email: string;

  firstName?: string;

  secondName?: string;

  firstSurname?: string;

  secondSurname?: string;

  phoneNumber?: string;

  phonePrefix?: string;

  accountsNumber?: string[];

  dob?: Date;

  address?: Address;

  status?: string;

  riskProfile?: string;

  personType?: number;

  externalId?: number;

  externalNumber?: string;

  bPartnerId?: string;

  enrollmentId?: string;

  documentNumber?: string;

  documentType?: number;

  username?: string;
}

class Address {
  @IsString()
  @IsOptional()
  buildingNumber?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  town: string;

  @IsString()
  postCode: string;

  @IsString()
  country: string;
}

export class ErrorData {
  @IsString()
  code?: string;

  @IsString()
  title?: string;

  @IsString()
  message?: string;
}

export class GetUserResponse {
  @ValidateNested({ each: true })
  @Type(() => User)
  @IsOptional()
  data?: User;

  @ValidateNested({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ErrorData)
  @IsOptional()
  error?: ErrorData;
}
