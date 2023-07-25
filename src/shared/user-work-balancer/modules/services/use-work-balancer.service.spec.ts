import { Test, TestingModule } from '@nestjs/testing';
import { UseWorkBalancerService } from './use-work-balancer.service';
import { Auth0Service } from '../../../../shared/providers/auth0-management-api/auth-services/auth0-service';
import { authGetEmailsMock } from '@dale/testcases/auth0-testcases';
import { BadRequestException } from '@nestjs/common';

describe('UseWorkBalancerService', () => {
  let service: UseWorkBalancerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UseWorkBalancerService,
        {
          provide: Auth0Service,
          useValue: {
            getEmailByParams: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UseWorkBalancerService>(UseWorkBalancerService);
  });

  describe('getRandomEmail', () => {
    it('should return a random email', async () => {
      const roles: string[] = ['role1', 'role2'];

      jest
        .spyOn(service.auth0Service, 'getEmailByParams')
        .mockResolvedValue(authGetEmailsMock);
      const result = await service.getRandomEmail(roles);

      expect(service.auth0Service.getEmailByParams).toHaveBeenCalledWith(roles);
      expect(result.email).toBe('juancapurador@yopmail.com');
    });

    it('should throw BadRequestException if no emails are found', async () => {
      const roles: string[] = ['role1', 'role2'];

      jest
        .spyOn(service.auth0Service, 'getEmailByParams')
        .mockResolvedValue([]);

      await expect(service.getRandomEmail(roles)).rejects.toThrowError(
        new BadRequestException('BOS026'),
      );
    });
  });
});
