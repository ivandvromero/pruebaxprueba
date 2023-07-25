import { IsOptional, IsString } from 'class-validator';

export class TransactionQuery {
  @IsOptional()
  transactionChannel?: string;

  @IsOptional()
  initialDate?: Date;

  @IsOptional()
  endDate?: Date;

  @IsOptional()
  depositNumber?: string;

  @IsOptional()
  identification?: string;

  @IsOptional()
  amount?: string;

  @IsOptional()
  receivingAccountId?: string;

  @IsOptional()
  idTransactionNumber?: string;

  @IsOptional()
  originAccountId?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  transactionType?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  businessName?: string;
}
