export const statementsTableHeaders = [
  'Fecha operación',
  'Hora',
  'Descripción',
  'Débito',
  'Crédito',
  'Saldo',
];

export const fieldsToNumber = {
  Debit: true,
  Credit: true,
  Balance: true,
};
export const fieldsToRename = {
  DateTransacion: 'DateTransaction',
  TimeTransacion: 'TimeTransaction',
};
export const castFieldsToNumber = (object) => {
  for (const key in object) {
    if (fieldsToNumber[key]) object[key] = Number(object[key]);
  }
};
export const transformationsForTableFields = (table) => {
  for (const item of table) {
    castFieldsToNumber(item);
    renameTableFields(item);
  }
  return table;
};
export const renameTableFields = (object) => {
  for (const key in object) {
    if (fieldsToRename[key]) {
      object[fieldsToRename[key]] = object[key];
      delete object[key];
    }
  }
  return object;
};
