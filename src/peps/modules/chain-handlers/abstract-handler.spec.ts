import { IHandlerPeps } from '../../shared/interfaces/handler.interface';
import { AbstractPepHandler } from './abstract-handler';

describe('AbstractHandler Testing', () => {
  function createHandler(): IHandlerPeps {
    return {
      handle: jest.fn(),
      setNext: jest.fn(),
    };
  }

  let handler: AbstractPepHandler;
  let handler1: IHandlerPeps;
  let handler2: IHandlerPeps;

  beforeEach(() => {
    handler = new AbstractPepHandler();
    handler1 = createHandler();
    handler2 = createHandler();
  });
  it('should set the next handler', () => {
    expect(handler.setNext(handler1)).toBe(handler1);
    expect(handler.setNext(handler2)).toBe(handler2);
  });

  it('should call the next handler when it is set', async () => {
    const request = { example: 'request' };
    const expectedResult = { example: 'result' };

    const handler1Mock = handler1.handle as jest.Mock;
    handler1Mock.mockResolvedValue(expectedResult);
    handler.setNext(handler1);

    const result = await handler.handle(request);

    expect(handler1Mock).toHaveBeenCalledWith(request);
    expect(result).toEqual(expectedResult);
  });

  it('should return null when the next handler is not set', async () => {
    const request = { example: 'request' };

    const result = await handler.handle(request);

    expect(result).toBeNull();
  });
});
