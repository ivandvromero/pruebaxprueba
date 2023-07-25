import { Injectable, Optional } from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { SessionTimeRepository } from '../repositories/session-time/session-time.repository';
import { SessionTimeDto } from '../dto/session-time';
import { FindRoleService } from '@dale/roles/services';

@Injectable()
export class CreateSessionTimeService {
  constructor(
    readonly sessionTimeRepository: SessionTimeRepository,
    private findRoleService: FindRoleService,
    @Optional() private logger: Logger,
  ) {}

  async run(sessionTimeDto: SessionTimeDto): Promise<any> {
    this.logger.debug('Get session time service started');
    const { role, sessionTime } = sessionTimeDto;
    const roleFound = await this.findRoleService.run(role);
    const sessionTimeToCreate = { role: roleFound, sessionTime };
    return await this.sessionTimeRepository.createSessionTime(
      sessionTimeToCreate,
    );
  }
}
