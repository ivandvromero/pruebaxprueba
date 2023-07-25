import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from '@dale/logger-nestjs';
import { DatabaseService } from '../../../shared/db/connection/connection.service';
import { RoleRepository } from './role.repository';
import {
  mappedRoles,
  outputRole,
  rolesFound,
  rolesToFind,
} from '@dale/testcases/dtos-testcases';
import { IFindCodeByRoleResponse } from '@dale/roles/shared/interfaces/role-response.interface';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';

describe('Transaction Code Testing', () => {
  let repository: RoleRepository;
  let dbService: DatabaseService;

  const mockSave = jest.fn(() => Promise.resolve(outputRole));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule.forRoot({
          context: 'Transaction Code - MODULE',
        }),
      ],
      providers: [
        RoleRepository,
        {
          provide: DatabaseService,
          useFactory: () => ({
            init: jest.fn(),
            getRepository: jest.fn(() => ({
              save: mockSave,
              create: jest.fn().mockResolvedValue(outputRole),
              find: jest.fn().mockResolvedValue([
                { id: 1, name: 'Admin' },
                { id: 2, name: 'User' },
              ]),
            })),
            isDbConnectionAlive: jest.fn(() => true),
          }),
        },
      ],
    }).compile();

    repository = module.get<RoleRepository>(RoleRepository);
    dbService = module.get<DatabaseService>(DatabaseService);
  });

  it('Should be repository defined', () => {
    expect(repository).toBeDefined();
    expect(dbService).toBeDefined();
  });

  describe('createRole', () => {
    it('Should create a new role', async () => {
      await repository.onModuleInit();
      const resp = await repository.createRole(outputRole);
      expect(resp).toEqual(outputRole);
    });

    it('Should throw a new error when trying create a role', async () => {
      try {
        await repository.onModuleInit();
        await repository.createRole({ name: null });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('findRoles', () => {
    it('should return an array of role response', async () => {
      await repository.onModuleInit();
      const resp = await repository.findRoles();
      expect(resp).toEqual([
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' },
      ]);
    });
  });

  describe('findCodesByRole', () => {
    it('Should return the codes for the given role name', async () => {
      await repository.onModuleInit();
      const codesByRole = {
        id: 1,
        name: 'Admin',
        codes: [
          { id: 1, code: 'code123', description: 'this is the description' },
        ],
      };

      jest.spyOn(repository, 'findCodesByRole').mockResolvedValue(codesByRole);

      const result: IFindCodeByRoleResponse = await repository.findCodesByRole(
        'Admin',
      );

      expect(result).toEqual(codesByRole);
    });

    it('Should find all codes when the filter is OperationalLeader', async () => {
      await repository.onModuleInit();
      const rolesData = [
        {
          id: 1,
          name: 'OperationalLeader',
          __codes__: [
            { id: 1, code: 'code123', description: 'this is the description' },
          ],
        },
      ];

      const expectedResult: IFindCodeByRoleResponse = {
        id: 1,
        name: 'OperationalLeader',
        codes: [
          { id: 1, code: 'code123', description: 'this is the description' },
        ],
      };

      const roles: IFindCodeByRoleResponse = {
        codes: rolesData[0].__codes__,
        name: rolesData[0].name,
        id: rolesData[0].id,
      };

      jest.spyOn(repository, 'findCodesByRole').mockResolvedValue(roles);

      const result = await repository.findCodesByRole('OperationalLeader');

      expect(result).toEqual(expectedResult);
    });

    it('Should throw NotFoundException when no codes are found for the given role name', async () => {
      try {
        await repository.onModuleInit();
        const repositorySpy = jest.spyOn(repository, 'findCodesByRole');
        await repository.findCodesByRole(null);

        expect(repositorySpy).toHaveBeenCalledWith(null);
      } catch (error) {
        await expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  it('Should find all the roles who shares the codes', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      find: jest.fn().mockResolvedValue(rolesFound),
    });
    await repository.onModuleInit();

    const resp = await repository.findRolesByCodes(rolesToFind);
    expect(resp).toEqual(mappedRoles);
  });

  it('Should throw a new error when trying create a role', async () => {
    try {
      await repository.onModuleInit();
      await repository.createRole({ name: null });
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }
  });

  it('Should find one role entity when searching by role name', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockResolvedValue(outputRole),
    });
    await repository.onModuleInit();

    const resp = await repository.findRole(outputRole.name);
    expect(resp).toEqual(outputRole);
  });

  it('Should find one role entity when searching by role name', async () => {
    jest.spyOn(dbService, 'getRepository').mockReturnValue({
      findOne: jest.fn().mockRejectedValue(new Error('something went wrong')),
    });
    await repository.onModuleInit();

    await expect(repository.findRole(outputRole.name)).rejects.toThrow(
      new BadRequestException(ErrorCodesEnum.BOS039, 'Error al buscar el rol.'),
    );
  });
});
