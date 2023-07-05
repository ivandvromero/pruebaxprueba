import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { LoggerModule } from '@dale/logger-nestjs';

describe('EnrollmentService', () => {
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: HttpService,
          useFactory: () => ({
            post: jest.fn(() => of({})),
            get: jest.fn(() => of({})),
          }),
        },
      ],
      imports: [LoggerModule.forRoot({ context: '' })],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
