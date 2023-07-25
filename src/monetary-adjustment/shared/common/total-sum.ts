import { MonetaryAdjustmentInterface } from '../interfaces/monetary-adjustment.interface';
import { convertTransactionType } from '../common/transaction-type-normalizer';

export function totalSum(
  adjustments: MonetaryAdjustmentInterface[],
  text: string,
): number {
  return adjustments
    .filter((item) => convertTransactionType(item.adjustmentType) === text)
    .reduce((total, current) => total + current.amount, 0);
}
