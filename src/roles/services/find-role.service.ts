import { Logger } from '@dale/logger-nestjs';
import { Injectable, Optional } from '@nestjs/common';
import { RoleRepository, RoleEntity } from '../repositories';

@Injectable()
export class FindRoleService {
  constructor(
    @Optional() private logger: Logger,
    private readonly roleRepository: RoleRepository,
  ) {}

  async run(role: string): Promise<RoleEntity> {
    this.logger.debug('find-role.service started!');
    return await this.roleRepository.findRole(role);
  }
}
