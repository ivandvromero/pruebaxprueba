import {
  IsDefined,
  IsNotEmpty,
  ValidateNested,
  IsNotEmptyObject,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BeneficiaryDetails {
  beneficiaryAccount: string;
  beneficiaryBankId: string;
}
export class Additionals {
  @IsOptional()
  ipAddress: string;

  @IsOptional()
  cus: string;
}
export class AdditionalsRQ {
  @IsOptional()
  ipAddress: string;

  @IsOptional()
  cus: string;

  @IsOptional()
  beneficiaryDetails: BeneficiaryDetails;

  @IsOptional()
  userCustomMessage?: string;
}
export class Orderer {
  @ValidateNested({ each: true })
  @Type(() => Additionals)
  @IsDefined()
  @IsNotEmptyObject()
  additionals: Additionals;
}
export class MessageRQ {
  @IsDefined()
  @IsNotEmpty()
  digitalService: string;

  @IsOptional()
  transactionId: string;

  @IsOptional()
  bankId: string;

  @ValidateNested({ each: true })
  @Type(() => Orderer)
  @IsOptional()
  orderer: Orderer;

  @ValidateNested({ each: true })
  @Type(() => Additionals)
  @IsOptional()
  additionals: AdditionalsRQ;

  @ValidateNested({ each: true })
  @Type(() => Beneficiaries)
  @IsOptional()
  beneficiaries: Beneficiaries[];
}
export class SecurityRQ {
  @IsOptional()
  hostId: string;
}
export class RQ {
  @ValidateNested({ each: true })
  @Type(() => MessageRQ)
  @IsDefined()
  @IsNotEmpty()
  messageRQ: MessageRQ;

  @IsOptional()
  securityRQ: SecurityRQ;
}

export class OthersId {
  @IsOptional()
  identificationId: string;
  @IsOptional()
  identificationType: string;
}

export class Account {
  @ValidateNested({ each: true })
  @Type(() => OthersId)
  @IsOptional()
  othersId: OthersId;
}

export class Beneficiaries {
  @ValidateNested({ each: true })
  @Type(() => Account)
  @IsOptional()
  account: Account;
}
