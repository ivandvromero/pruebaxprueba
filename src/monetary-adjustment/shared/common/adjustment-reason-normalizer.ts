import { AdjustmentReason } from '../enums/adjustment-reason.enum';

export function convertAdjustmentReason(stringChain) {
  const converted = stringChain
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  if (converted.includes('RECLAMACION')) {
    return AdjustmentReason.AJUSTE_POR_RECLAMACION;
  }
  if (converted.includes('CONCILIACION')) {
    return AdjustmentReason.AJUSTE_POR_CONCILIACION;
  }
  return AdjustmentReason.EMPTY;
}
