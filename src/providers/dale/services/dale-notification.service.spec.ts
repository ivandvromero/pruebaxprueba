import { Test, TestingModule } from '@nestjs/testing';
import { DaleNotificationService } from './dale-notification.service';
import { of } from 'rxjs';
describe('DaleNotificationService', () => {
  let service: DaleNotificationService;
  const mockData = {
    id: 'f3f9354d-349a-41af-b635-e918aeb37e73',
    ext: '+57',
    phone: '3202789291',
    resend: false,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DaleNotificationService,
        {
          provide: 'KAFKA_CLIENT',
          useFactory: () => ({
            emit: jest.fn(() => of({})),
          }),
        },
      ],
    }).compile();

    service = module.get<DaleNotificationService>(DaleNotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('SendSmsNotification', () => {
    it('Success', async () => {
      const res = await service.sendSmsNotification(
        mockData.id,
        mockData.ext,
        mockData.phone,
        mockData.resend,
      );
      expect(res).toBeDefined();
    });
  });
});
