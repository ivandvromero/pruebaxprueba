import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/common/cache';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: CACHE_MANAGER,
          useFactory: () => ({
            get: jest.fn(() => 3),
            set: jest.fn(() => true),
            del: jest.fn(() => true),
            ttl: jest.fn(() => 3600),
          }),
        },
      ],
      imports: [CacheModule.register()],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get cache data', async () => {
    const result = await service.getCache('mock-data');
    expect(result).toEqual(3);
  });
  it('should set cache data', async () => {
    const result = await service.setCache('mock-data', 3);
    expect(result).toBeTruthy();
  });
  it('should delete cache data', async () => {
    const result = await service.deleteCache('mock-data');
    expect(result).toBeTruthy();
  });

  it('should get cache ttl', async () => {
    const result = await service.getTtl('mock-data');
    expect(result).toEqual(3600);
  });
});
