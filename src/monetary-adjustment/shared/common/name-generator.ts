export function nameGenerator() {
  const date = new Date();
  const text = 'MASIVOMN';

  const day = ('0' + date.getDate()).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear().toString().slice(-2);
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);

  const formattedName = `${text}${day}${month}${year}${hour}${minute}${second}.xlsx`;
  return formattedName;
}
