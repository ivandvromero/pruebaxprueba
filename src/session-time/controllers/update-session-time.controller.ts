import {
  Body,
  Controller,
  Optional,
  Patch,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { AuditInterceptor } from '../../shared/interceptors/audit.interceptor';
import { Logger } from '@dale/logger-nestjs/dist/src/logger.service';
import { UserInfoInterceptor } from '../../shared/interceptors/get-user-info.interceptor';
import { Permissions } from '@dale/auth/permissions.decorator';
import { UpdateSessionTimeDto } from '../dto';
import { UpdateSessionTimeService } from '../services/update-session-time.service';
import { SessionTimeEntity } from '../repositories';

@ApiTags('SessionTime')
@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/sessionTime')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class UpdateSessionTimeController {
  constructor(
    readonly updateSessionTimeService: UpdateSessionTimeService,
    @Optional() private logger: Logger,
  ) {}

  @Version('1')
  @Patch()
  @ApiOperation({
    summary: 'Update a time session by id',
    description: 'This endpoint can be used for update the time session by id',
  })
  @ApiOkResponse({
    description: 'Time updated successfully',
    type: SessionTimeEntity,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:write')
  @UseInterceptors(UserInfoInterceptor)
  async updateSessionTime(
    @Body() updateSessionTimeDto: UpdateSessionTimeDto,
  ): Promise<SessionTimeEntity> {
    this.logger.debug('Get session time controller started');
    return await this.updateSessionTimeService.run(updateSessionTimeDto);
  }
}
