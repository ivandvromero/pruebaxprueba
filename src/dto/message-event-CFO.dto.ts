import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

export class LegacyId {
  @IsOptional()
  accountNumber: string;

  @IsOptional()
  accountType: string;
}
export class OthersId {
  @IsOptional()
  identificationId: string;
}
export class Account {
  @Type(() => LegacyId)
  @IsOptional()
  legacyId: LegacyId;

  @ValidateNested({ each: true })
  @Type(() => OthersId)
  @IsDefined()
  @IsNotEmptyObject()
  othersId: OthersId;
}
export class OrdererBP {
  name?: string;
  secondName?: string;
  lastName?: string;
  cellPhone?: string;
  phone?: string;
  externalId?: string;
}
export class BP {
  name?: string;
  secondName?: string;
  lastName?: string;
  cellPhone?: string;
  phone?: string;
  externalId?: string;
}
export class Beneficiary {
  BP: BP;
}
export class AdditionalsOrderer {
  ordererBP?: OrdererBP;
  sourceDetails?: {
    sourceAccount: string;
    sourceBankId: string;
    TypeProductOrigin: string;
  };
  S125_TD1?: string;
  S125_DOC1?: string;
}
export class AdditionalsBeneficiary {
  beneficiary?: Beneficiary;
  sourceDetails?: {
    sourceAccount: string;
    sourceBankId: string;
    TypeProductOrigin: string;
  };
  S125_TD1?: string;
  S125_DOC1?: string;
}
export class Orderer {
  @ValidateNested({ each: true })
  @Type(() => Account)
  @IsOptional()
  account: Account;

  @ValidateNested({ each: true })
  @Type(() => AdditionalsOrderer)
  @IsOptional()
  additionals: AdditionalsOrderer;
}
export class Beneficiaries {
  @Type(() => Account)
  @IsOptional()
  account: Account;

  @ValidateNested({ each: true })
  @Type(() => AdditionalsBeneficiary)
  @IsOptional()
  additionals: AdditionalsBeneficiary;
}
export class General {
  @IsNotEmpty()
  @IsDefined()
  transactionAmount: number;

  @IsNotEmpty()
  @IsDefined()
  transactionType: string;

  @IsOptional()
  transactionDetails: string;
}

export class SourceDetails {
  @IsOptional()
  sourceAccount: string;
}

export class BeneficiaryDetails {
  @IsOptional()
  beneficiaryAccount?: string;
  @IsOptional()
  beneficiaryBankId?: string;
}

export class Additionals {
  @IsOptional()
  userCustomMessage?: string;
  @Type(() => SourceDetails)
  @IsOptional()
  sourceDetails?: SourceDetails;
  @IsOptional()
  beneficiaryDetails?: BeneficiaryDetails;
  @IsOptional()
  branchId?: string;
  @IsOptional()
  cus?: string;
}

export class CFO {
  @ValidateNested({ each: true })
  @Type(() => General)
  @IsDefined()
  @IsNotEmptyObject()
  general: General;

  @ValidateNested({ each: true })
  @Type(() => Orderer)
  @IsOptional()
  orderer: Orderer;

  @Type(() => Beneficiaries)
  @IsOptional()
  beneficiaries: Beneficiaries[];

  @Type(() => Additionals)
  @IsOptional()
  additionals?: Additionals;
}
