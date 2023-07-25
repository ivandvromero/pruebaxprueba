import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Optional,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  Version,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@dale/logger-nestjs';
import { ErrorCodesEnum } from '@dale/exceptions/code-errors/error-codes.enum';
import { FileMassiveMonetaryAdjustment } from '@dale/monetary-adjustment/repositories/file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import {
  PaginationAdjustmentsResponse,
  PaginationMassiveAdjustmentsResponse,
  PaginationRegisterAdjustmentsResponse,
} from '@dale/monetary-adjustment/shared/common';
import {
  MonetaryAdjustmentEntity,
  ResponseInterface,
} from '@dale/monetary-adjustment/shared/interfaces';
import { AuditInterceptor } from '../../../../shared/interceptors/audit.interceptor';
import {
  MonetaryAdjustmentDto,
  AdjustmentQueryDto,
  MassiveMonetaryAdjustmentFileDto,
  GetAdjustmentQueryReportsDto,
  AdjustmentValidationsDTO,
  GetArchiveMassiveDto,
  AdjustmentStateDto,
} from '../dto';
import { MonetaryAdjustmentService } from '../service/monetary-adjustment.service';
import { BadRequestException } from '@dale/exceptions/custom-errors/custom-exception';
import { UserInfoInterceptor } from '../../../../shared/interceptors/get-user-info.interceptor';
import { UserInfoInterface } from '@dale/monetary-adjustment/shared/interfaces/user-info.interface';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { Permissions } from '@dale/auth/permissions.decorator';
import { FindCodesByRoleService } from '@dale/roles/services';

@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/monetaryAdjustment')
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
//implements MonetaryAdjustmentRepositoryDB
export class MonetaryAdjustmentController {
  constructor(
    private readonly monetaryAdjustmentService: MonetaryAdjustmentService,
    private readonly findCodesByRoleService: FindCodesByRoleService,
    @Optional() private logger: Logger,
  ) {}

  @Version('1')
  @Post()
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'Create an adjustment',
    description: 'Creates a new monetary adjustment',
  })
  @ApiCreatedResponse({
    description: 'Monetary Adjustment created successfully',
    type: MonetaryAdjustmentEntity,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write')
  @UseInterceptors(UserInfoInterceptor)
  async createAdjustment(
    @Req() req,
    @Body() monetaryAdjustmentDTO: MonetaryAdjustmentDto,
  ): Promise<MonetaryAdjustmentEntity> {
    this.logger.debug('createAdjustment.controller started!');
    const { role, name, email } = req.userInfo;
    const allowedCodes = await this.findCodesByRoleService.run(role);
    const isValid = allowedCodes.codes.some(
      (code) => code.code === monetaryAdjustmentDTO.transactionCode,
    );
    if (!isValid) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS024,
        'El código ingresado no coincide con su rol.',
      );
    }
    const adjustmentMetadata: UserInfoInterface = {
      name,
      email,
      role,
    };
    return this.monetaryAdjustmentService.createAdjustment(
      adjustmentMetadata,
      monetaryAdjustmentDTO,
    );
  }

  @Version('1')
  @Get()
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'Return an array of monetary adjustments',
    description:
      'This endpoints return an array of monetary adjustments with query parameters as limit, offset and the transaction level',
  })
  @ApiOkResponse({
    description: 'Return an array of monetary adjustments',
    type: [PaginationAdjustmentsResponse],
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:read', 'MonetaryAdjustment:write')
  @UseInterceptors(UserInfoInterceptor)
  async findAll(
    @Req() req,
    @Query() adjustmentQueryDto: AdjustmentQueryDto,
  ): Promise<PaginationAdjustmentsResponse> {
    const { role, email, transactionLevel } = req.userInfo;
    const listCodes = await this.findCodesByRoleService.run(role);
    const codes = listCodes.codes.map((code) => code.code);

    const adjustmentMetadata: UserInfoInterface = {
      email,
      role,
      transactionLevel,
      codes,
    };

    this.logger.debug(`Transaction level to search ${transactionLevel}`);
    return this.monetaryAdjustmentService.findAll(
      adjustmentMetadata,
      adjustmentQueryDto,
    );
  }

  @Version('1')
  @Post('/file')
  @ApiOperation({
    summary: 'Create a file with multiple adjustment',
    description: 'Create a file with multiple adjustment',
  })
  @ApiCreatedResponse({
    description: 'File with monetary Adjustment created successfully',
    type: FileMassiveMonetaryAdjustment,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write')
  @UseInterceptors(UserInfoInterceptor)
  createMassiveAdjustment(
    @Req() req,
    @Body() massiveMonetaryAdjustmentFileDto: MassiveMonetaryAdjustmentFileDto,
  ): Promise<FileMassiveMonetaryAdjustment> {
    this.logger.debug('createAdjustment.controller started!');
    const { role, name, email } = req.userInfo;
    const adjustmentMetadata: UserInfoInterface = {
      role,
      email,
      name,
    };
    return this.monetaryAdjustmentService.createMassiveAdjustment(
      massiveMonetaryAdjustmentFileDto,
      adjustmentMetadata,
    );
  }

  @Version('1')
  @Get('file')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'Return an array of file objects',
    description:
      'This endpoints return an array of file objects with query parameters as limit, offset and the transaction level',
  })
  @ApiOkResponse({
    description: 'Return an array of massive adjustments files objects',
    type: [PaginationMassiveAdjustmentsResponse],
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write', 'MonetaryAdjustment:read')
  @UseInterceptors(UserInfoInterceptor)
  async findAllMassive(
    @Req() req,
    @Query() adjustmentQueryDto: AdjustmentQueryDto,
  ): Promise<PaginationMassiveAdjustmentsResponse> {
    const { email, transactionLevel } = req.userInfo;
    const adjustmentMetadata: UserInfoInterface = {
      email,
      transactionLevel,
    };
    this.logger.debug(`Transactions level to search ${transactionLevel}`);
    return await this.monetaryAdjustmentService.findAllMassiveAdjustment(
      adjustmentMetadata,
      adjustmentQueryDto,
    );
  }

  @Version('1')
  @Get('reports')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'Return an array of monetary adjustments reports',
    description:
      'This endpoints return an array adjustments objects with query parameters as limit, offset, date, single or massive, deposit number or  code.',
  })
  @ApiOkResponse({
    description: 'Return an array of adjustments with pagination',
    type: PaginationRegisterAdjustmentsResponse,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustmentReport:read')
  async adjustmentReports(
    @Query() getAdjustmentQueryReportsDto: GetAdjustmentQueryReportsDto,
  ): Promise<PaginationRegisterAdjustmentsResponse> {
    return await this.monetaryAdjustmentService.adjustmentReports(
      getAdjustmentQueryReportsDto,
    );
  }

  @Version('1')
  @Post('/:adjustmentId')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary:
      'Return an object of ResponseInterface -> {result: boolean, nextLevel: number}.',
    description:
      'This endpoints return an object of ResponseInterface -> {result: boolean, nextLevel: number} and this can patch the transactionLevel and transactionState.',
  })
  @ApiOkResponse({
    description:
      'Return an object of ResponseInterface -> {result: boolean, nextLevel: number}.',
    type: [MonetaryAdjustmentEntity],
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:read')
  @UseInterceptors(UserInfoInterceptor)
  adjustmentValidations(
    @Param('adjustmentId') adjustmentId: string,
    @Body() payload: AdjustmentValidationsDTO,
    @Req() req,
  ): Promise<ResponseInterface> {
    const { transactionLevel, email, name, role } = req.userInfo;
    this.logger.debug(`Transaction level to search ${transactionLevel}`);

    if (!payload.approved && !payload.comment)
      throw new BadRequestException(
        ErrorCodesEnum.BOS005,
        'Debes enviar el comentario.',
      );
    const adjustmentMetadata: UserInfoInterface = {
      role,
      email,
      name,
    };

    return this.monetaryAdjustmentService.adjustmentValidations(
      adjustmentId,
      payload,
      transactionLevel,
      adjustmentMetadata,
    );
  }

  @Version('1')
  @Get('archive')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'Return an archive',
    description: 'This endpoints allows you to create an excel file',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write', 'MonetaryAdjustment:read')
  async generateArchive(
    @Res() res: Response,
    @Query() params: GetArchiveMassiveDto,
  ) {
    const { id, log = 'false' } = params;
    const buffer = await this.monetaryAdjustmentService.createArchive(id, log);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }

  @Version('1')
  @Post('file/:fileAdjustmentsId')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary:
      'Return an object of ResponseInterface -> {result: boolean, nextLevel: number}.',
    description:
      'This endpoints return an object of ResponseInterface -> {result: boolean, nextLevel: number} and this can patch the transactionLevel and transactionState.',
  })
  @ApiOkResponse({
    description:
      'Return an object of ResponseInterface -> {result: boolean, nextLevel: number}.',
    type: [MonetaryAdjustmentEntity],
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:read')
  @UseInterceptors(UserInfoInterceptor)
  async fileAdjustmentValidations(
    @Param('fileAdjustmentsId') fileAdjustmentsId: string,
    @Body() payload: AdjustmentValidationsDTO,
    @Req() req,
  ): Promise<ResponseInterface> {
    const { transactionLevel, name, email, role } = req.userInfo;
    const adjustmentMetadata: UserInfoInterface = {
      role,
      email,
      name,
    };
    this.logger.debug(`Transaction level to search ${transactionLevel}`);

    if (!payload.approved && !payload.comment) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS005,
        'Debes enviar el comentario.',
      );
    }
    return await this.monetaryAdjustmentService.adjustmentFiletValidations(
      fileAdjustmentsId,
      payload,
      transactionLevel,
      adjustmentMetadata,
    );
  }

  @Version('1')
  @Post('file/reprocess/:fileAdjustmentsId')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary:
      'Return an object of ResponseInterface -> {result: boolean, nextLevel: number}.',
    description:
      'This endpoints allows reprocessing of settings that failed when sending them to PTS',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write')
  async reprocessFileAdjustment(
    @Param('fileAdjustmentsId') fileAdjustmentsId: string,
  ): Promise<void | ResponseInterface> {
    return await this.monetaryAdjustmentService.reprocessFile(
      fileAdjustmentsId,
    );
  }

  @Version('1')
  @Get('count/state')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'returns a numeric value',
    description:
      'returns the number of approved and rejected according to role',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:write', 'MonetaryAdjustment:read')
  @UseInterceptors(UserInfoInterceptor)
  async countAdjustmentState(@Req() req): Promise<AdjustmentStateDto> {
    const { role } = req.userInfo;
    const listCodes = await this.findCodesByRoleService.run(role);
    const codes = listCodes.codes.map((code) => code.code);
    const res = await this.monetaryAdjustmentService.getAdjustmentState(codes);
    return res;
  }

  @Version('1')
  @Get('count/individual')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'returns a numeric value',
    description:
      'This endpoints allows you to obtain the pending individual adjustments according to the role',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:read')
  @UseInterceptors(UserInfoInterceptor)
  async countPendingIndividual(@Req() req): Promise<number> {
    const adjustmentQuery: AdjustmentQueryDto = {
      limit: 1,
    };
    const { role, email, transactionLevel } = req.userInfo;
    const listCodes = await this.findCodesByRoleService.run(role);
    const codes = listCodes.codes.map((code) => code.code);

    const adjustmentMetadata: UserInfoInterface = {
      role,
      email,
      transactionLevel,
      codes,
    };
    const res = this.monetaryAdjustmentService.countPendingIndividual(
      adjustmentMetadata,
      adjustmentQuery,
    );
    return res;
  }

  @Version('1')
  @Get('count/massive')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'returns a numeric value',
    description:
      'This endpoints allows you to obtain the pending mass adjustments according to the role',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustment:read')
  @UseInterceptors(UserInfoInterceptor)
  async countPendingMassive(@Req() req): Promise<number> {
    const { role, email, transactionLevel } = req.userInfo;
    const adjustmentQuery: AdjustmentQueryDto = {
      limit: 1,
    };
    const adjustmentMetadata: UserInfoInterface = {
      role,
      email,
      transactionLevel,
    };
    const res = this.monetaryAdjustmentService.countPendingMassive(
      adjustmentMetadata,
      adjustmentQuery,
    );
    return res;
  }

  @Version('1')
  @Get('registrer/archive')
  @ApiTags('Monetary Adjustment')
  @ApiOperation({
    summary: 'Return an archive of registrer',
    description:
      'This endpoints allows you to create an excel file of registrers',
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('MonetaryAdjustmentReport:read')
  async generateArchiveReport(
    @Res() res: Response,
    @Query() params: GetAdjustmentQueryReportsDto,
  ) {
    const buffer = await this.monetaryAdjustmentService.generateArchiveReport(
      params,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(buffer);
  }
}
