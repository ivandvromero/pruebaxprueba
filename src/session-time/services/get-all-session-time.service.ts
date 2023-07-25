import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { SessionTimeRepository } from '../repositories/session-time/session-time.repository';
import { SessionTimeAllResponseDto } from '../dto/session-time-all-response';

@Injectable()
export class GetAllSessionTimeService {
  constructor(
    readonly sessionTimeRepository: SessionTimeRepository,
    @Optional() private logger: Logger,
  ) {}

  async run(): Promise<SessionTimeAllResponseDto[]> {
    this.logger.debug('Get All session time service started');
    const sessionTimeArray =
      await this.sessionTimeRepository.getAllSessionTime();
    const resp = sessionTimeArray.map((sessionTime) => {
      return new SessionTimeAllResponseDto(sessionTime);
    });
    return resp;
  }
}
