import { ICreateTransaction } from '@dale/client/common/interfaces';
import {
  IsAlphanumeric,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}
export class CreateTransactionPtsDto implements ICreateTransaction {
  @IsString()
  @IsAlphanumeric()
  depositNumber: string;

  @IsPositive()
  @IsNumber()
  amount: number;

  @IsString()
  transactionType: string;

  @IsString()
  transactionChannel: string;

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
