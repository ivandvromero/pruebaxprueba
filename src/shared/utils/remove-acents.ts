export const removeAccents = (originalString: string): string => {
  return originalString?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};
