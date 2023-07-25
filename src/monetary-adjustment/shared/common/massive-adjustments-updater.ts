import { TransactionType } from '../enums/adjustment-type.enum';
import { MassiveMonetaryAdjustmentFileInterface } from '../interfaces/massive-monetary-adjustment-file.interface';
import { totalSum } from './total-sum';

export function MassiveAdjustmentUpdater(
  file: MassiveMonetaryAdjustmentFileInterface,
  assignedTo?: string,
) {
  const { adjustments } = file;

  const updatedTotalCredit = totalSum(adjustments, TransactionType.CREDIT);
  const updatedTotalDebit = totalSum(adjustments, TransactionType.DEBIT);
  const updatedTotalRecords = adjustments.length;

  return {
    ...file,
    totalCredit: updatedTotalCredit,
    totalDebit: updatedTotalDebit,
    totalRecords: updatedTotalRecords,
    assignedTo,
  };
}
