import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { SessionTimeRepository } from '../repositories/session-time/session-time.repository';
import { UpdateSessionTimeDto } from '../dto';
import { SessionTimeEntity } from '../repositories';

@Injectable()
export class UpdateSessionTimeService {
  constructor(
    readonly sessionTimeRepository: SessionTimeRepository,
    @Optional() private logger: Logger,
  ) {}

  async run(
    updateSessionTimeDto: UpdateSessionTimeDto,
  ): Promise<SessionTimeEntity> {
    this.logger.debug('Get session time service started');
    return await this.sessionTimeRepository.updateSessionTime(
      updateSessionTimeDto,
    );
  }
}
