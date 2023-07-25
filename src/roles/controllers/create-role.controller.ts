import {
  Body,
  Controller,
  Optional,
  Post,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { CreateRoleService } from '../services/create-role.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { Permissions } from '@dale/auth/permissions.decorator';
import { AuditInterceptor } from '@dale/interceptors/audit.interceptor';
import { rolesData, IRolesDto, IRoleResponse } from '../shared';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/roles')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class CreateRoleController {
  rolesData = rolesData;
  constructor(
    @Optional() private logger: Logger,
    private readonly roleService: CreateRoleService,
  ) {}

  @Version('1')
  @Post()
  @ApiTags('Create Role')
  @ApiOperation({
    summary: 'Create a role',
    description: 'This endpoints allows you to create a new role.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  async createRole(@Body() role: IRolesDto): Promise<IRoleResponse> {
    this.logger.debug('createRole.controller started!');
    return this.roleService.run(role);
  }
}
