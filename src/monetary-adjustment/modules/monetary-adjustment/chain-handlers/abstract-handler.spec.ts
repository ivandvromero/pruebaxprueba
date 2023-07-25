import { AbstractHandler } from './abstract-handler';
import { IHandler } from './handler.interface';

describe('AbstractHandler test', () => {
  function createHandler(): IHandler {
    return {
      handle: jest.fn(),
      setNext: jest.fn(),
    };
  }

  let handler: AbstractHandler;
  let handler1: IHandler;
  let handler2: IHandler;

  beforeEach(() => {
    handler = new AbstractHandler();
    handler1 = createHandler();
    handler2 = createHandler();
  });
  it('should set the next handler', () => {
    expect(handler.setNext(handler1)).toBe(handler1);
    expect(handler.setNext(handler2)).toBe(handler2);
  });
});
