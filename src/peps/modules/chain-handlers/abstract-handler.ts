import { IHandlerPeps } from '../../shared/interfaces/handler.interface';

export class AbstractPepHandler implements IHandlerPeps {
  private nextHandler: IHandlerPeps;
  public setNext(handler: IHandlerPeps): IHandlerPeps {
    this.nextHandler = handler;

    return handler;
  }

  public handle(request: any): Promise<any> {
    return this.nextHandler ? this.nextHandler.handle(request) : null;
  }
}
