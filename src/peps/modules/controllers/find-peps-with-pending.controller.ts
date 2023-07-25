import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { FindPepsWithPendingService } from '../services/find-peps-with-pending.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuditInterceptor } from '../../../shared/interceptors/audit.interceptor';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { Permissions } from '@dale/auth/permissions.decorator';
import { levelsToPermissions } from '../../shared/constants/levelsToPermissions';
import { AdjustmentQueryDto } from '@dale/monetary-adjustment/modules/monetary-adjustment/dto';
import { IFindPepsDto } from '../../shared/interfaces/find-peps-dto.interface';
import { PepStatus } from '../../shared/enums/pep-status.enum';
import { PepsValidationsPermissions } from '../../shared/enums/pep-validations-permissions.enum';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/peps')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class FindPepsWithPendingController {
  constructor(private readonly service: FindPepsWithPendingService) {}

  @Version('1')
  @Get()
  @ApiTags('Find PEPS with pending status.')
  @ApiOperation({
    summary: 'Find Peps with pending status.',
    description: 'This endpoints allows you to find roles.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions(
    PepsValidationsPermissions.COMMERCIAL_LEADER_WRITE,
    PepsValidationsPermissions.COMMERCIAL_BOSS_READ,
  )
  run(@Req() req, @Query() query: AdjustmentQueryDto) {
    const statusLevel = levelsToPermissions[req.user.permissions];
    const payload: IFindPepsDto = {
      limit: query.limit || 5,
      offset: query.offset || 0,
      statusLevel,
      status: PepStatus.PENDING,
    };
    return this.service.run(payload);
  }
}
