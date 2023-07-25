import { Logger } from '@dale/logger-nestjs';
import { Injectable, Optional } from '@nestjs/common';
import { RoleRepository } from '../repositories/role/role.repository';
import { IRoleResponse } from '../shared';

@Injectable()
export class FindRolesService {
  constructor(
    @Optional() private logger: Logger,
    private readonly roleRepository: RoleRepository,
  ) {}

  async run(): Promise<IRoleResponse[]> {
    this.logger.debug('find-roles.service started!');
    return await this.roleRepository.findRoles();
  }
}
