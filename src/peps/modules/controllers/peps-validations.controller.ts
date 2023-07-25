import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { PepsValidationsService } from '../services/peps-validations.service';
import { IPepsValidationsDto } from '../../shared/interfaces/peps-validations-dto.interface';
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
export class PepsValidationsController {
  constructor(private readonly service: PepsValidationsService) {}

  @Version('1')
  @Post('validations')
  @ApiTags('Validations to Peps.')
  @ApiOperation({
    summary: 'Validations to Peps.',
    description:
      'This endpoints allows you to approve or reject peps enrolment.',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions(
    PepsValidationsPermissions.COMMERCIAL_LEADER_WRITE,
    PepsValidationsPermissions.COMMERCIAL_BOSS_READ,
  )
  async run(@Body() payload: IPepsValidationsDto, @Req() req) {
    const statusLevel = levelsToPermissions[req.user.permissions];

    if (
      statusLevel === 1 &&
      (!payload.date ||
        !payload.name ||
        !payload.identification ||
        !payload.status)
    ) {
      throw new BadRequestException(
        'Revisa por favor los campos que estás enviando',
      );
    }

    const dataToSend = {
      ...payload,
      validatorEmail: req.user.email,
      approverEmail: req.user.email,
      statusLevel,
    };
    statusLevel === 1
      ? delete dataToSend.approverEmail
      : delete dataToSend.validatorEmail;

    return this.service.run(dataToSend);
  }
}
