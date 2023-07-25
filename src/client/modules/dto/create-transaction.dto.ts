import {
  IsAlphanumeric,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ICreateTransaction } from '../../common/interfaces/create-transaction.interface';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}
export class CreateTransactionDto implements ICreateTransaction {
  @IsString()
  @IsAlphanumeric()
  depositNumber: string;

  @IsPositive()
  @IsNumber()
  amount: number;

  @IsString()
  @IsEnum(TransactionType)
  transactionType: TransactionType;

  @IsString()
  transactionChannel: string;

  @IsString()
  @IsOptional()
  externalId?: string;

  @IsOptional()
  @IsDate()
  date?: Date;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  fees?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  vat?: number;

  @IsPositive()
  @IsNumber()
  @IsOptional()
  gmf?: number;
}
