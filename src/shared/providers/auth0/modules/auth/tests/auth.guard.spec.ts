import { UnauthorizedException } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { Auth0Guard } from '../auth.guard';

export const mockUser = {
  email: 'tester@test.com',
  emailVerified: true,
};
describe('Auth Guard', () => {
  let testingModule: TestingModule;
  let guardInstance: Auth0Guard;

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [Auth0Guard],
    }).compile();

    guardInstance = testingModule.get(Auth0Guard);
  });

  describe('HandleRequest', () => {
    it('should return the valid object based on input arguments', async () => {
      process.env.CLOUD_SERVICE_PROVIDER = 'NOT_LOCAL';
      expect(guardInstance.handleRequest(null, mockUser)).toEqual(mockUser);
      expect(() => guardInstance.handleRequest('error', null)).toThrow('error');
      const exception = new UnauthorizedException();
      expect(() => guardInstance.handleRequest(null, null)).toThrow(exception);
    });
  });
});
