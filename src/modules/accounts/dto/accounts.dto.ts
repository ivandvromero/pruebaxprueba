import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsObject,
  IsUUID,
  ValidateNested,
  Matches,
  Length,
  IsEnum,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import {
  ErrorCodes,
  ErrorMessage,
} from '../../../shared/constants/system-errors';
import { ErrorObjectTypeToString } from '../../../shared/utils/map-validation-errors';

// enums
export enum AccountStatuses {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ACTIVE_IN_ARREARS = 'ACTIVE_IN_ARREARS',
  MATURED = 'MATURED',
  LOCKED = 'LOCKED',
  DORMANT = 'DORMANT',
  CLOSED = 'CLOSED',
  ACTIVE = 'ACTIVE',
  CLOSED_WRITTEN_OFF = 'CLOSED_WRITTEN_OFF',
  WITHDRAWN = 'WITHDRAWN',
  CLOSED_REJECTED = 'CLOSED_REJECTED',
}

// base and non exported data classes
class Address {
  @IsString()
  @IsOptional()
  @ApiProperty()
  buildingNumber?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  street?: string;

  @IsString()
  @ApiProperty()
  town: string;

  @IsString()
  @ApiProperty()
  postCode: string;

  @IsString()
  @ApiProperty()
  @Length(3, 3, {
    message: 'Country must be a 3 character country code',
  })
  country: string;
}
class AccountUser {
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @Matches(/^\d{4}(-)(((0)\d)|((1)[0-2]))(-)([0-2]\d|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @IsOptional()
  @ApiProperty({
    default: 'YYYY-MM-DD',
  })
  dob?: Date;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @ApiProperty()
  @Type(() => Address)
  address?: Address;
}
class AccountDetails {
  accountNumber: string;
  accountState: AccountStatuses;
  accountType: string;
  accountId: string;
  availableBalance: number;
  currencyCode: string;
}

// request DTOs
export class CreateAccountDto {
  @IsObject()
  @ValidateNested()
  @ApiProperty()
  @Type(() => AccountUser)
  user: AccountUser;

  @IsString()
  @ApiProperty()
  productId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  trackingId?: string;

  @IsString()
  @ApiProperty()
  accountType: string;

  @IsString()
  @ApiProperty()
  accountName: string;

  @IsString()
  @ApiProperty()
  clientId: string;

  @IsString()
  @ApiProperty()
  accountHolderName: string;

  @IsString()
  @ApiProperty()
  branchCode: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  uniqueRequestId?: string;
}
export class AccountDetailsByClientIdDto {
  @IsString()
  @ApiProperty()
  clientId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  trackingId?: string;

  @IsOptional()
  @ApiProperty()
  @IsEnum(AccountStatuses)
  accountState?: AccountStatuses;
}
export class AccountDetailsByAccountIdDto {
  @IsString()
  @IsNotEmpty({
    message: () => {
      return ErrorObjectTypeToString(
        ErrorCodes.VERIFY_ACCOUNTHOLDERID_CODE,
        ErrorMessage.VERIFY_VALIDATION_REASON,
      );
    },
  })
  @ApiProperty({
    description: `The id or encoded key of the deposit account	`,
  })
  accountId: string;
}
export class AccountDetailsByAccountIdQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: `The trackingId of the transaction` })
  trackingId?: string;
}

// response DTOs
export class CreateAccountServiceResponse extends AccountDetails {}
export class CreateAccountResponse extends CreateAccountServiceResponse {
  @ApiProperty()
  sortCode: string;

  @ApiProperty()
  accountHolderName: string;
}
export class AccountDetailsByAccountIdResponse extends AccountDetails {
  @ApiProperty()
  clientId: string;
}
export class AccountDetailsByClientIdResponse extends AccountDetails {}

export class AccountNumbersByClientIdResponse {
  @ApiProperty()
  accountNumbers: string[];
}
export class AccountNumbersByClientIdDto {
  @IsString()
  @ApiProperty()
  externalCustomerId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  trackingId?: string;
}

// events DTOs
export class AccountPTSEventDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  bPartnerId: string;

  @IsString()
  @ApiProperty()
  customerExternalId: string;

  @IsString()
  @ApiProperty()
  customerExternalNumber: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  enrollmentId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phonePrefix?: string;
}

export class AccountEventDto {
  @IsString()
  @ApiProperty()
  userId: string;

  @IsString()
  @ApiProperty()
  accountId: string;

  @IsString()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @ApiProperty()
  enrollmentId: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  phonePrefix?: string;

  @IsString()
  @ApiProperty()
  customerExternalId: string;

  @IsString()
  @ApiProperty()
  customerExternalNumber: string;
}

export class UpdateAccountEventDto {
  @IsString()
  @ApiProperty()
  userId: string;
  @IsString()
  @ApiProperty()
  accountId: string;
  @IsString()
  @ApiProperty()
  crmDepositId: string;
  @IsString()
  @ApiProperty()
  crmContactAgreementId: string;
  @IsString()
  enrollmentId: string;
}

export class GetAccountsByUserIdRequestDto {
  @IsString()
  userId: string;
}

export class GetAccountsByUserIdResponseDto {
  id: string;
  accountNumber: string;
  agreementId: string;
  crmDepositId: string;
  crmContactAgreementId: string;
}
export class GetAccountsByUserIdDataResponseDto {
  data: GetAccountsByUserIdResponseDto[];
  constructor(partial: Partial<GetAccountsByUserIdDataResponseDto>) {
    Object.assign(this, partial);
  }
}
export class GetCertificateStrategyDataResponseDto {
  templateName: string;
  data: Array<IDetails>;
}

export class IDetails {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsNotEmpty()
  value: string | boolean | number | Array<any>;
}
export class User {
  id: string;

  email?: string;

  firstName?: string;

  secondName?: string;

  firstSurname?: string;

  secondSurname?: string;

  phoneNumber?: string;

  phonePrefix?: string;

  dob?: Date;

  address?: Address;

  status: string;

  riskProfile?: string;

  personType?: number;

  externalId?: number;

  externalNumber?: string;

  bPartnerId?: string;

  enrollmentId?: string;

  documentNumber?: string;

  documentType?: string;

  shortNameDocumentType?: string;

  username?: string;

  phoneNumberVerified?: boolean;
}

export class GetCertificateStrategyDataInputDto {
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => IDetails)
  params: IDetails[];

  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => User)
  user: User;
}

export class GetCertificateResponseDto {
  url: string;
}
export class AccumulatorOptions {
  @IsNotEmpty()
  @IsString()
  idOption: string;
  @IsNotEmpty()
  @IsString()
  nameOption: string;
  @IsNotEmpty()
  @IsString()
  accumulator: string;
  @IsNotEmpty()
  @IsNumber()
  dailyAmountLimit: number;
  @IsNotEmpty()
  @IsInt()
  dailyQuantityLimit: number;
  @IsNotEmpty()
  @IsInt()
  permittedLimits: number;
  @IsOptional()
  @IsBoolean()
  hasUpdates: boolean;
}

export class ModifyLimitsInputDto {
  @IsString()
  @ApiProperty()
  accountId: string;
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => AccumulatorOptions)
  accumulators: AccumulatorOptions[];
}

export class GetStatementsStrategyDataInputDto {
  @IsNotEmpty()
  @IsString()
  templateName: string;

  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => IDetails)
  params: IDetails[];

  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => User)
  user: User;
}
