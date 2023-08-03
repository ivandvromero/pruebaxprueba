import { parseToColombiaTime } from '@dale/shared-nestjs/utils/date';
export const toIsoString = (date: Date): string => {
  return parseToColombiaTime(date);
};
