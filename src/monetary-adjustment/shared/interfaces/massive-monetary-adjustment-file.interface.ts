import { MonetaryAdjustmentEntityOrm } from 'src/monetary-adjustment/repositories/monetary-adjustment/monetary-adjustment.entity';
import { AdjustmentState } from '../enums/adjustment-state.enum';
import { TransactionLevel } from '../enums/transaction-level.enum';

export interface MassiveMonetaryAdjustmentFileInterface {
  adjustmentState?: AdjustmentState | null;
  comment?: string | null;
  createdAt?: Date;
  fileName: string;
  formattedName?: string;
  id?: string;
  size: number;
  totalCredit: number;
  totalDebit: number;
  totalRecords: number;
  transactionLevel?: TransactionLevel | number;
  updatedAt?: Date;
  usersEmails?: string[];
  adjustments: MonetaryAdjustmentEntityOrm[];
}
