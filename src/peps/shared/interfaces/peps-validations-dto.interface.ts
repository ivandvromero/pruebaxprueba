import { PepStatus } from '../enums/pep-status.enum';

export interface IPepsValidationsDto {
  id?: string;
  date: string;
  answerDate?: Date;
  identification: string;
  name: string;
  status?: PepStatus;
  statusLevel: number;
  comment: string;
  validatorEmail?: string;
  approverEmail?: string;
  isCreated: boolean;
  phone: string;
  email: string;
}
