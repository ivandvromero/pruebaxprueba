import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { SessionTimeRepository } from '../repositories/session-time/session-time.repository';
import { FindRoleService } from '@dale/roles/services';
import { SessionTimeResponseDto } from '../dto/session-time-response';
import { DefaultSessionTime } from '../../shared/config/shared-default-session-time-config';

@Injectable()
export class GetSessionTimeService {
  constructor(
    readonly sessionTimeRepository: SessionTimeRepository,
    private findRoleService: FindRoleService,
    @Optional() private logger: Logger,
  ) {}

  async run(role: string): Promise<SessionTimeResponseDto> {
    this.logger.debug('Get session time service started');
    const roleEntity = await this.findRoleService.run(role);

    if (!roleEntity) {
      return { sessionTime: DefaultSessionTime };
    }

    const timeEntity = await this.sessionTimeRepository.getSessionTime(
      roleEntity,
    );

    if (!timeEntity) {
      return { sessionTime: DefaultSessionTime };
    }

    return { sessionTime: timeEntity.sessionTime };
  }
}
