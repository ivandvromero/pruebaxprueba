import {
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateNested,
  IsUUID,
  IsBoolean,
  ValidateIf,
  IsDefined,
  IsNumberString,
  MaxLength,
  IsNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateUserRequestDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  @IsOptional()
  readonly email?: string;
  @IsString()
  firstName: string;
  @IsString()
  secondName?: string;
  @IsString()
  firstSurname: string;
  @IsString()
  secondSurname?: string;
  @IsString()
  documentType: string;
  @IsString()
  documentNumber: string;
  @IsNumber()
  gender: number;
  @IsNumber()
  @IsOptional()
  userGender?: number;
  @IsString()
  phoneNumber: string;
  @IsString()
  username: string;
  @IsString()
  phonePrefix?: string;
  @IsString()
  enrollmentId: string;
  @IsString()
  deviceId: string;
}

export class CreateUserResponseDto {
  id: string;
  username: string;
}
export class CreateUserDataResponseDto {
  data: CreateUserResponseDto;
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
  @Length(3, 3, { message: 'Country must be a 3 character country code' })
  country: string;
}
export class UserDetails {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @ApiProperty({
    default: 'YYYY-MM-DD',
  })
  dob?: Date;

  @IsObject()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  address?: Address;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  riskProfile?: string;

  @IsBoolean()
  @IsOptional()
  phoneNumberVerified?: boolean;

  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'first name',
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Last name',
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Phone number',
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @ApiProperty({
    description: 'User email',
    default: 'YYYY-MM-DD',
  })
  dob?: Date;

  @ApiProperty({
    description: 'Address',
  })
  @IsObject()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Address)
  address?: Address;

  @ApiProperty({
    description: 'Status',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Risk profile',
  })
  @IsString()
  @IsOptional()
  riskProfile?: string;

  @ApiProperty({
    description: 'Tracking identifier',
  })
  @IsUUID()
  @IsOptional()
  trackingId?: string;

  @ApiProperty({
    description: 'Phone number is verified',
  })
  @IsBoolean()
  @IsOptional()
  phoneNumberVerified?: boolean;
  @IsString()
  @IsOptional()
  documentNumber?: string;
  @IsString()
  @IsOptional()
  documentType?: number;

  @IsString()
  @IsOptional()
  deviceId?: string;
}

export class GetUserDto {
  @ApiProperty({
    description: 'User document number',
  })
  @IsOptional()
  @MaxLength(15)
  @Matches(/\d/)
  @IsNumberString()
  @IsOptional()
  documentNumber?: string;

  @ApiProperty({
    description: 'User phone number',
  })
  @ValidateIf((item) => !item.documentNumber)
  @Matches(/\d/)
  @Length(10)
  @IsNumberString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'User account number',
  })
  @ValidateIf((item) => !item.documentNumber && !item.phoneNumber)
  @MaxLength(15)
  @Matches(/\d/)
  @IsNumberString()
  @IsOptional()
  accountNumber?: string;

  @ApiProperty({
    description: 'User email',
  })
  @ValidateIf(
    (item) => !item.documentNumber && !item.phoneNumber && !item.accountNumber,
  )
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Tracking identifier',
  })
  @IsUUID()
  @IsOptional()
  trackingId?: string;

  @IsUUID()
  @IsOptional()
  id?: string;
}

export class UpdatePhoneNumberDto {
  @ApiProperty({
    description: 'User identifier',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Phone number',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'Tracking identifier',
  })
  @IsUUID()
  @IsOptional()
  trackingId?: string;
}
export class UpdateDeviceDto {
  @ApiProperty({
    description: 'User identifier',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Device identifier',
  })
  @IsString()
  deviceId: string;

  @ApiProperty({
    description: 'Tracking identifier',
  })
  @IsUUID()
  @IsOptional()
  trackingId?: string;
}
export class UpdatePhoneNumberResponse {
  @ApiProperty({
    description: 'Request identifier',
  })
  requestId: string;
}
export class UpdateDeviceResponse {
  @ApiProperty({
    description: 'User identifier',
  })
  userId: string;
  @ApiProperty({
    description: 'Device identifier',
  })
  deviceId: string;
}

export class UpdateDeviceDataResponse {
  data: UpdateDeviceDto;
}
export class User {
  @ApiProperty({
    description: 'User id',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    description: 'First name',
  })
  firstName?: string;

  @ApiProperty({
    description: 'Second name',
  })
  secondName?: string;

  @ApiProperty({
    description: 'First Surname',
  })
  firstSurname?: string;

  @ApiProperty({
    description: 'Second Surname',
  })
  secondSurname?: string;

  @ApiProperty({
    description: 'Phone number',
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'Phone prefix',
  })
  phonePrefix?: string;

  @ApiProperty({
    description: 'Accounts number',
  })
  accountsNumber?: string[];

  @ApiProperty({
    description: 'Dob',
    default: 'YYYY-MM-DD',
  })
  dob?: Date;

  @ApiProperty({
    description: 'Address',
  })
  address?: Address;

  @ApiProperty({
    description: 'User Status',
  })
  status?: string;

  @ApiProperty({
    description: 'Risk profile',
  })
  riskProfile?: string;

  @ApiProperty({
    description: 'Person Type',
  })
  personType?: number;

  @ApiProperty({
    description: 'External CRM Id',
  })
  externalId?: number;

  @ApiProperty({
    description: 'External CRM Number',
  })
  externalNumber?: string;

  @ApiProperty({
    description: 'B Partner Id',
  })
  bPartnerId?: string;

  @ApiProperty({
    description: 'Enrollment Id',
  })
  enrollmentId?: string;

  @ApiProperty({
    description: 'Document number',
  })
  documentNumber?: string;

  @ApiProperty({
    description: 'Document type',
  })
  documentType?: number;

  @ApiProperty({
    description: 'Username',
  })
  username?: string;

  @ApiProperty({
    description: 'Device Id',
  })
  deviceId?: string;
}

export class UserResponse {
  message: string;
}

export class ValdiateUserExistDto {
  @ValidateIf((item) => item.phoneNumber == undefined)
  @MaxLength(15)
  @Matches(/\d/)
  @IsNumberString()
  @ApiProperty({
    description: 'Account Number',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Phone Number',
  })
  @ValidateIf((item) => item.accountNumber == undefined)
  @MaxLength(10)
  @IsDefined()
  @Matches(/\d/)
  @IsNumberString()
  phoneNumber: string;
}

export class ValidateUserExistResponse {
  @ApiProperty({
    description: 'Phone Number',
  })
  phoneNumber: string;

  @ApiProperty({
    description: 'Account Number',
  })
  accountNumber: string[];
}

export class AddUserDepositDto {
  @ApiProperty({
    description: 'User id',
  })
  @IsUUID()
  readonly userId: string;

  @ApiProperty({
    description: 'Account number',
  })
  @IsNumberString()
  accountNumber: string;

  @ApiProperty({
    description: 'Tracking identifier',
  })
  @IsUUID()
  @IsOptional()
  trackingId?: string;
}

export class GetUserResponse {
  data?: User;
  error?: any;
}

// events DTOs
export class UserEventDto {
  @IsString()
  @ApiProperty()
  bPartnerId: string;

  @IsString()
  @ApiProperty()
  externalId: number;

  @IsString()
  @ApiProperty()
  externalNumber: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  enrollmentId: string;
}

export class CreateUserLog {
  responseIdentifier: string;
  documentNumber: string;
  documentType: string;
  attempt: number;
  phone: string;
}
