import {
  Controller,
  Get,
  Optional,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import { FindRolesService } from '../services/find-roles.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from '@dale/auth/permissions.decorator';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { AuditInterceptor } from '@dale/interceptors/audit.interceptor';
import { rolesData, IRoleResponse } from '../shared';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/roles')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class FindRolesController {
  rolesData = rolesData;
  constructor(
    @Optional() private logger: Logger,
    private readonly roleService: FindRolesService,
  ) {}

  @Version('1')
  @Get()
  @ApiTags('Find Roles')
  @ApiOperation({
    summary: 'Find Roles',
    description: 'This endpoints allows you to find roles.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  async run(): Promise<IRoleResponse[]> {
    this.logger.debug('findRoles.controller started!');
    return this.roleService.run();
  }
}
