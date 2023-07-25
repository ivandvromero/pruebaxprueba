import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { ResponseInterface } from 'src/monetary-adjustment/shared/interfaces/response-interface';

export interface IHandler {
  setNext: (handler: IHandler) => IHandler;
  handle: (
    adjustmentId: string,
    transactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
  ) => Promise<ResponseInterface>;
}
