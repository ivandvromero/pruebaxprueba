import { TestingModule, Test } from '@nestjs/testing';
import { DatabaseService } from './connection.service';
import * as utils from '../../config/db-config';
import { config } from '../../config/typeorm.config';

describe('the db connection service', () => {
  let testingModule: TestingModule;
  let dbService: DatabaseService;

  const managerMock = jest.spyOn(
    DatabaseService.prototype as any,
    'manager',
    'get',
  );
  const createConenctionMock = jest.spyOn(
    DatabaseService.prototype as any,
    'createConnection',
  );
  const getConnectionIndexMock = jest.spyOn(
    DatabaseService.prototype as any,
    'getConnectionIndex',
  );
  const removeOldConnectionsMock = jest.spyOn(
    DatabaseService.prototype as any,
    'removeOldConnections',
  );
  const getDbConfigMock = jest.spyOn(utils, 'getDbConfig');
  const optionsMock = { key: 'value' };

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();
    dbService = testingModule.get(DatabaseService);
  });

  it('should be defined', () => {
    expect(dbService).toBeDefined();
  });

  function prepareMock() {
    const mockConnections = ['1'];
    beforeEach(() => {
      getDbConfigMock.mockImplementation(() => <any>optionsMock);
      managerMock.mockImplementation(() => ({
        connections: mockConnections,
      }));
    });
    afterEach(() => {
      getDbConfigMock.mockReset();
      managerMock.mockReset();
    });
  }

  describe('the on module destroy function', () => {
    prepareMock();
    it('should destroy the conenction', async () => {
      await dbService.onModuleDestroy();
      expect(managerMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('the on application shutdown function', () => {
    prepareMock();
    it('should shutdown the conenction', async () => {
      await dbService.onModuleDestroy();
      expect(managerMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('the get repository function', () => {
    const getRepositoryMock = jest.fn();
    beforeEach(() => {
      jest.spyOn(dbService, 'connection', 'get').mockImplementation(() => ({
        getRepository: getRepositoryMock,
      }));
    });
    afterEach(() => {
      jest.spyOn(dbService, 'connection', 'get').mockReset();
    });
    it('should call connection getRepository', async () => {
      await dbService.getRepository('test');
      expect(getRepositoryMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('the create connection function', () => {
    const mockCreate = jest.fn(() => optionsMock);
    beforeEach(() => {
      managerMock.mockImplementation(() => ({
        create: mockCreate,
      }));
    });
    afterEach(() => {
      managerMock.mockReset();
    });
    it('should return the connection', async () => {
      const res = await dbService.createConnection(config);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(res).toEqual(optionsMock);
    });
  });

  describe('the get connections function', () => {
    it('should get the active connection', async () => {
      const res = await dbService.connection;
      expect(res).toEqual(undefined);
    });
  });

  describe('the init function', () => {
    const mockConnect = jest.fn();
    const mockConnections = ['1'];
    beforeEach(() => {
      getDbConfigMock.mockImplementation(() => <any>optionsMock);
      managerMock.mockImplementation(() => ({
        connections: mockConnections,
      }));
      createConenctionMock.mockImplementation(() => ({
        connect: mockConnect,
      }));
      getConnectionIndexMock.mockImplementation(() => jest.fn());
      removeOldConnectionsMock.mockImplementation(() => jest.fn());
    });
    afterEach(() => {
      getDbConfigMock.mockReset();
      managerMock.mockReset();
      createConenctionMock.mockReset();
      getConnectionIndexMock.mockReset();
      removeOldConnectionsMock.mockReset();
    });
    it('should initialize the conenction', async () => {
      await dbService.init(config, 'username');
      expect(getDbConfigMock).toHaveBeenCalledTimes(1);
      expect(getDbConfigMock).toHaveBeenCalledWith('username');
      expect(mockConnect).toHaveBeenCalledTimes(1);
    });

    it('should catch the error if thrown and remove connection', async () => {
      removeOldConnectionsMock.mockReset();
      removeOldConnectionsMock.mockImplementation(() => {
        throw new Error('test-error');
      });
      await dbService.init(config, 'username');
      expect(mockConnections).toHaveLength(1);
    });
  });

  describe('the is db connection alive function', () => {
    const getQueyMock = jest.fn();
    const error = new Error('test-error');
    beforeEach(() => {
      jest.spyOn(dbService, 'connection', 'get').mockImplementation(() => ({
        query: getQueyMock,
      }));
    });
    afterEach(() => {
      jest.spyOn(dbService, 'connection', 'get').mockReset();
    });
    it('should call connection isDbConnectionAlive', async () => {
      await dbService.isDbConnectionAlive();
      expect(getQueyMock).toHaveBeenCalledTimes(1);
    });

    it('should catch the error if thrown query error', async () => {
      jest.spyOn(dbService, 'connection', 'get').mockImplementation(() => {
        throw error;
      });
      const res = await dbService.isDbConnectionAlive();
      expect(res).toEqual(error.message);
    });
  });
});
