import { PepStatus } from '../enums/pep-status.enum';

export interface IPatchPepDto {
  identification: string;
  answerDate?: Date;
  status?: PepStatus;
  statusLevel: number;
  comment?: string;
  validatorEmail?: string;
  approverEmail?: string;
  phone?: string;
  email?: string;
}
