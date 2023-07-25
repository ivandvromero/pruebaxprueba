import { ITransactionCodeResponse } from '../../../transaction-codes/shared/interfaces/transaction-code-response.interface';

export interface IRoleResponse {
  id: number;
  name: string;
}

export interface IFindCodeByRoleResponse {
  id: number;
  name: string;
  codes: ITransactionCodeResponse[];
}
