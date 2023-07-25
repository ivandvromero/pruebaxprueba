import { AdjustmentState } from '../enums/adjustment-state.enum';

export interface ResponseInterface {
  result?: boolean;
  nextLevel?: number;
  status?: AdjustmentState;
  id?: string;
  message?: string;
}
