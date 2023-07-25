import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HistoricalPepsService } from '../services/historical-peps.service';
import { AuditInterceptor } from '../../../shared/interceptors/audit.interceptor';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { Permissions } from '@dale/auth/permissions.decorator';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/peps')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class HistoicalPepsController {
  constructor(private readonly service: HistoricalPepsService) {}

  @Version('1')
  @Get('historical')
  @ApiTags('Historical Peps.')
  @ApiOperation({
    summary: 'Historical Peps.',
    description: 'This endpoints allows you to find historical peps.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  run() {
    return this.service.run(null, null);
  }
}
