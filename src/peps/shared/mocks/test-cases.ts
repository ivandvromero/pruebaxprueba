import { PepStatus } from '../enums/pep-status.enum';
import { IPatchPepDto } from '../interfaces/patch-pep-dto.interface';
import { PaginationFindPepsResponse } from '../pagination/find-peps-pagination-response';

export const outputPepCreated = {
  date: '20/10/2023',
  identification: 'C.C 9082543573',
  name: 'David Diaz',
  status: 'APPROVE',
  file: 'localhost:8080/file',
};

export const dataToUpdatePep: IPatchPepDto = {
  identification: 'CC 3582389568',
  statusLevel: 2,
  answerDate: new Date('10/20/2023'),
  status: PepStatus.APPROVED,
  validatorEmail: 'validator@email.com',
  approverEmail: 'approver@email.com',
};

export const findPepsWithPendingQuery = {
  limit: 5,
  offset: 0,
  status: PepStatus.PENDING,
  statusLevel: 2,
};

export const findPepsWithPendingResponse = new PaginationFindPepsResponse(
  [],
  5,
  0,
  0,
);
