import {
  Controller,
  Get,
  Optional,
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
import { GetAllSessionTimeService } from '../services/get-all-session-time.service';
import { SessionTimeAllResponseDto } from '../dto/session-time-all-response';

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
export class GetAllSessionTimeController {
  constructor(
    readonly getAllSessionTimeService: GetAllSessionTimeService,
    @Optional() private logger: Logger,
  ) {}

  @Version('1')
  @Get('/all')
  @ApiOperation({
    summary: 'Get session time according with the user role',
    description:
      'This endpoint will return an object with the session time established for each role',
  })
  @ApiOkResponse({
    description: 'Time session found successfully',
    type: SessionTimeAllResponseDto,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('SuperAdmin:read')
  @UseInterceptors(UserInfoInterceptor)
  async getAllSessionTime(): Promise<SessionTimeAllResponseDto[]> {
    this.logger.debug('Get session time controller started');
    return await this.getAllSessionTimeService.run();
  }
}
