import { Logger } from '@dale/logger-nestjs';
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import serviceConfiguration from '../../../config/service-configuration';
import { ErrorCodesEnum } from '../../../shared/code-erros/error-codes.enum';

import { v4 as uuid } from 'uuid';
import { UserInfoEnrollmentResponse } from '../constants/enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(private httpService: HttpService, private logger: Logger) {}

  async getUserInfoByEnrollmentId(
    id: string,
  ): Promise<UserInfoEnrollmentResponse> {
    try {
      this.logger.log('Begin call to enrollment service');
      const url = `${
        serviceConfiguration().providers.enrollment_np_service
      }/enrollment-natural-person/${id}`;
      const { data: response } = await lastValueFrom(
        this.httpService.get(url, {
          headers: {
            TransactionId: uuid(),
            ChannelId: 'User',
            SessionId: uuid(),
            Timestamp: new Date().toISOString(),
            IpAddress: '127.0.0.1',
            Application: 'UserService',
            ApiVersion: 1,
          },
        }),
      );
      this.logger.log('End call to enrollment service');
      return response.data.person as UserInfoEnrollmentResponse;
    } catch (error) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS010, error);
    }
  }
}
