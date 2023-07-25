export interface IHandlerPeps {
  setNext: (handler: IHandlerPeps) => IHandlerPeps;
  handle: (request: any) => Promise<any>;
}
