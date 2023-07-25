import { Logger } from '@dale/logger-nestjs';
import { Injectable, Optional } from '@nestjs/common';
import { IFindCodeByRoleResponse } from '../shared';
import { RoleRepository } from '../repositories/role/role.repository';

@Injectable()
export class FindCodesByRoleService {
  constructor(
    @Optional() private logger: Logger,
    private readonly roleRepository: RoleRepository,
  ) {}

  async run(filter: string): Promise<IFindCodeByRoleResponse> {
    this.logger.debug('find.service started!');
    return await this.roleRepository.findCodesByRole(filter);
  }
}
