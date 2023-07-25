export function dateFormatter(date: string | Date | null) {
  if (date !== '' && date !== null) {
    const dateWithoutFormat = new Date(date).toISOString();
    return dateWithoutFormat.slice(0, 10);
  }
  return '';
}
