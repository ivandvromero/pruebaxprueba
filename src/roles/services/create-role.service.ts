import { Logger } from '@dale/logger-nestjs';
import { Injectable, Optional } from '@nestjs/common';
import { RoleRepository } from '../repositories';
import { IRolesDto, IRoleResponse } from '../shared';

@Injectable()
export class CreateRoleService {
  constructor(
    @Optional() private logger: Logger,
    private readonly roleRepository: RoleRepository,
  ) {}

  async run(role: IRolesDto): Promise<IRoleResponse> {
    this.logger.debug('create-role.service started!');
    return this.roleRepository.createRole(role);
  }
}
