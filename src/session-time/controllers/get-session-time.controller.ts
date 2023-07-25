import {
  Controller,
  Get,
  Optional,
  Req,
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
import { Logger } from '@dale/logger-nestjs';
import { UserInfoInterceptor } from '../../shared/interceptors/get-user-info.interceptor';
import { SessionTimeResponseDto } from '../dto/session-time-response';
import { GetSessionTimeService } from '../services/get-session-time.service';

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
export class GetSessionTimeController {
  constructor(
    readonly getSessionTimeService: GetSessionTimeService,
    @Optional() private logger: Logger,
  ) {}

  @Version('1')
  @Get()
  @ApiOperation({
    summary: 'Get session time according with the user role',
    description:
      'This endpoint will return an object with the session time established for each role',
  })
  @ApiOkResponse({
    description: 'Time session found successfully',
    type: SessionTimeResponseDto,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @UseInterceptors(UserInfoInterceptor)
  async getSessionTime(@Req() req): Promise<SessionTimeResponseDto> {
    this.logger.debug('Get session time controller started');
    const { role } = req.userInfo;
    return await this.getSessionTimeService.run(role);
  }
}
