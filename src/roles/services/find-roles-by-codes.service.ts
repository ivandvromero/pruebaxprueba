import { Logger } from '@dale/logger-nestjs';
import { Injectable, Optional } from '@nestjs/common';
import { RoleRepository } from '../repositories/role/role.repository';

@Injectable()
export class FindRolesByCodesService {
  constructor(
    @Optional() private logger: Logger,
    private readonly roleRepository: RoleRepository,
  ) {}

  async run(codes: string[]): Promise<string[]> {
    this.logger.debug('find-roles.service started!');
    return await this.roleRepository.findRolesByCodes(codes);
  }
}
