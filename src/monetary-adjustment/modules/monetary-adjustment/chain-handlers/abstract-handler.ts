import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { IHandler } from './handler.interface';
import { ResponseInterface } from 'src/monetary-adjustment/shared/interfaces/response-interface';

export class AbstractHandler implements IHandler {
  private nextHandler: IHandler;
  public setNext(handler: IHandler): IHandler {
    this.nextHandler = handler;

    return handler;
  }

  public handle(
    adjustmentId: string,
    transactionLevel: number,
    adjustmentMetadata: UserInfoInterface,
  ): Promise<ResponseInterface> {
    return this.nextHandler
      ? this.nextHandler.handle(
          adjustmentId,
          transactionLevel,
          adjustmentMetadata,
        )
      : null;
  }
}
