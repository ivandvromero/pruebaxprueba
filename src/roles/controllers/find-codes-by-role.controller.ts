import {
  Controller,
  Get,
  Optional,
  Req,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { Logger } from '@dale/logger-nestjs';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FindCodesByRoleService } from '../services/find-codes-by-role.service';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { AuditInterceptor } from '@dale/interceptors/audit.interceptor';
import { IFindCodeByRoleResponse } from '../shared';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/role')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class FindCodesByRoleController {
  constructor(
    @Optional() private logger: Logger,
    private readonly roleService: FindCodesByRoleService,
  ) {}

  @Version('1')
  @Get('/codes')
  @ApiTags('Find Codes by Role')
  @ApiOperation({
    summary: 'Find Codes by Role',
    description: 'This endpoints allows you to find codes by role.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  async run(@Req() req): Promise<IFindCodeByRoleResponse> {
    this.logger.debug('findCodesByRole.controller started!');
    const role = req?.user['https://panel-administrativo/roles'][0] || '';
    return this.roleService.run(role);
  }
}
