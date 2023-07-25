import { TransactionType } from '../enums/adjustment-type.enum';
import { AdjustmentState } from '../enums/adjustment-state.enum';
import { TransactionLevel } from '../enums/transaction-level.enum';
import { AdjustmentReason } from '../enums/adjustment-reason.enum';

export interface MonetaryAdjustmentInterface {
  id?: string;
  dateFile?: string;
  clientId?: string;
  depositNumber: string; //transaction Id
  amount: number; //Desde el front vamos a recibir el amount y el validateAmount y debe ser el mismo valor para almacenar el amount
  validateAmount?: number;
  adjustmentType: TransactionType;
  adjustmentState?: AdjustmentState | null;
  transactionLevel?: TransactionLevel | number;
  transactionCode: string;
  transactionDescription: string;
  fees: number; //commission
  vat: number; //iva
  gmf: number; //4x1000
  createdAt?: Date;
  updatedAt?: Date;
  comment?: string | null;
  isFromFile?: boolean;
  adjustmentReason: AdjustmentReason;
  responsible?: string;
  transactionName?: string;
}
