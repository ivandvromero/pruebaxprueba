import {
  Body,
  Controller,
  Optional,
  Post,
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
import { SessionTimeDto } from '../dto/session-time';
import { CreateSessionTimeService } from '../services/create-session-time.service';
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
export class CreateSessionTimeController {
  constructor(
    readonly createSessionTimeService: CreateSessionTimeService,
    @Optional() private logger: Logger,
  ) {}

  @Version('1')
  @Post()
  @ApiOperation({
    summary: 'Create a session time for a role',
    description:
      'This endpoint can be used to create a session time for a role',
  })
  @ApiOkResponse({
    description: 'Session time created successfully',
    type: SessionTimeEntity,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:read')
  @UseInterceptors(UserInfoInterceptor)
  async createSessionTimeController(
    @Body() sessionTimeDto: SessionTimeDto,
  ): Promise<SessionTimeEntity> {
    this.logger.debug('Get session time controller started');
    return await this.createSessionTimeService.run(sessionTimeDto);
  }
}
