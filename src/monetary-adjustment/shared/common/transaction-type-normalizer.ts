import { TransactionType } from '../enums/adjustment-type.enum';

export function convertTransactionType(stringChain: string) {
  const converted = stringChain
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  return converted === 'CREDITO' || converted === 'CREDIT'
    ? TransactionType.CREDIT
    : TransactionType.DEBIT;
}
