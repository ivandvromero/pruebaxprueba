import { PepStatus } from '../enums/pep-status.enum';

export interface IFindPepsDto {
  limit: number;
  offset: number;
  statusLevel: number;
  status: PepStatus;
}
