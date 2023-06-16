import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsDefined,
  IsNotEmpty,
  IsOptional,
  ArrayMinSize,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

export class AccountBalances {
  totalBalance: number;
}
export class TransactionDetails {
  transactionChannelKey: string;
  transactionChannelId: string;
}
export class Data {
  @IsOptional()
  id: string;

  @IsOptional()
  accountBalances: AccountBalances;

  @IsOptional()
  creationDate: string;

  @IsOptional()
  amount: number;

  @IsOptional()
  transactionDetails: TransactionDetails;
}
export class Confirmations {
  @ValidateNested({ each: true })
  @Transform(({ value }) =>  {
    return typeof value === 'string' ? {} : value;
  })
  @Type(() => Data)
  @IsOptional()
  data: Data;
}
export class SourceDetails {
  sourceAccount: string;
  sourceBankId: string;
}
export class Additionals {
  sourceDetails: SourceDetails;
}
export class Responses {
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => Confirmations)
  confirmations: Confirmations[];

  @IsNotEmpty()
  @IsDefined()
  PTSId: string;

  @IsOptional()
  additionals;
}
export class MessageRS {
  @IsArray()
  @IsObject({ each: true })
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Responses)
  responses: Responses[];
}
export class StatusRS {
  @IsNotEmpty()
  @IsDefined()
  code: string;
  description: string;
}
export class HeaderRS {
  msgId: string;
  msgIdOrg: string;

  @IsDefined()
  @IsNotEmpty()
  timestamp: string;
}
export class RS {
  @ValidateNested({ each: true })
  @Type(() => HeaderRS)
  @IsDefined()
  @IsNotEmptyObject()
  headerRS: HeaderRS;

  @ValidateNested({ each: true })
  @Type(() => MessageRS)
  @IsDefined()
  @IsNotEmptyObject()
  messageRS: MessageRS;

  @ValidateNested({ each: true })
  @Type(() => StatusRS)
  @IsDefined()
  @IsNotEmptyObject()
  statusRS: StatusRS;
}
