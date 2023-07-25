import { TestingModule, Test } from '@nestjs/testing';
import { PermissionsGuard } from '../permission.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/nestjs-testing';

describe('Permission Guard', () => {
  let testingModule: TestingModule;
  let guardInstance: PermissionsGuard;
  let reflector: Reflector;

  const createMockContext = (req: any) =>
    createMock<ExecutionContext>({
      getArgs: () => [req],
    });

  beforeEach(() => {
    reflector = new Reflector();
    guardInstance = new PermissionsGuard(reflector);
  });

  beforeAll(async () => {
    testingModule = await Test.createTestingModule({
      providers: [PermissionsGuard],
    }).compile();

    guardInstance = testingModule.get(PermissionsGuard);
  });

  describe('canActivate', () => {
    it('should be defined', () => {
      expect(guardInstance).toBeDefined();
    });

    it('should valida scope', async () => {
      const context = createMockContext({
        user: { permissions: ['test:write'] },
      });
      expect(await guardInstance.canActivate(context)).toBeTruthy();
    });
  });
});
