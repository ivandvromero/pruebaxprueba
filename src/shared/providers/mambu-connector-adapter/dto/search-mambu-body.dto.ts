import { IFilterCriteria } from '../../../../client/common/interfaces';

interface SortingCriteria {
  field: string;
  order: string;
}

interface FilterCriteria extends IFilterCriteria {
  operator: string;
}

export class SearchMambuBodyDto {
  sortingCriteria: SortingCriteria;
  filterCriteria: FilterCriteria[];

  constructor(fields: IFilterCriteria[]) {
    this.sortingCriteria = {
      field: 'id',
      order: 'ASC',
    };

    this.filterCriteria = fields.map((field) => {
      let response: FilterCriteria;
      if (field.secondValue) {
        response = {
          field: field.field,
          operator: 'BETWEEN',
          value: field.value,
          secondValue: field.secondValue,
        };
      } else {
        response = {
          field: field.field,
          operator: 'EQUALS',
          value: field.value,
        };
      }
      return response;
    });
  }
}
