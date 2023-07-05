import { USER_STATUS_MAPPING } from './../../constants/user-status';
import {
  IDNV_INFO_CHECKS_COMPLETED_TOPIC,
  OTP_REQUEST_OTP_VERIFICATION,
} from '@dale/shared-nestjs/constants/kafka-topics';
import {
  UpdateUserDto,
  GetUserDto,
  GetUserResponse,
  User,
  UpdatePhoneNumberDto,
  UpdatePhoneNumberResponse,
  ValdiateUserExistDto,
  AddUserDepositDto,
  CreateUserRequestDto,
  CreateUserDataResponseDto,
  UpdateDeviceDto,
  UpdateDeviceDataResponse,
} from './dto/user.dto';
import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Post,
  Inject,
  HttpStatus,
  Res,
  Version,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { EventPattern, ClientKafka } from '@nestjs/microservices';
import { Logger } from '@dale/logger-nestjs';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { functionalities } from '../../constants/common';
import { INVALID_PAYLOAD_ERROR } from '@dale/shared-nestjs/constants/errors';
import { ConditionalAuditCreator } from '@dale/shared-nestjs/utils/audit/audit-creator';
import { ActorType } from '@dale/shared-nestjs/utils/audit/types';
import { v4 as uuidv4 } from 'uuid';
import { publishToQueue } from '@dale/shared-nestjs/utils/messaging-queue';
import { OtpActionEvents } from '@dale/shared-nestjs/constants/otp-action-events';
import { Response } from 'express';
import { RequestHeader } from '../../shared/decorators/headers.decorator';
import { HeaderDTO } from '../../shared/dto/header.dto';
import { Headers } from '../../shared/decorators/headers-swagger.decorator';

import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import serviceConfiguration from '../../config/service-configuration';
import {
  BadRequestExceptionDale,
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import {
  UpdateLocateDto,
  UpdateLocateUserResponseData,
} from './dto/update-locate.dto';
import { RequirementsUserResponseData } from './dto/requirements-user.dto';

@Headers()
@ApiTags(serviceConfiguration().service.name)
@Controller('user')
@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'please select a version',
  required: true,
})
export class UserServiceController {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
    private readonly userService: UserService,
    private logger: Logger,
  ) {}

  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.GET_USER_DATA,
      actorType: ActorType.USER,
    },
    requestMap: {
      'query.email': 'actorId',
    },
    outputMap: {
      'result.id': 'executionContext.userId',
    },
  })
  @Get()
  @ApiOperation({
    summary: 'Get user',
  })
  @ApiOkResponse({
    type: User,
    description: 'Successfully fetched user',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async getUser(
    @Query()
    {
      documentNumber,
      phoneNumber,
      accountNumber,
      email,
      trackingId,
      id,
    }: GetUserDto,
  ): Promise<GetUserResponse> {
    try {
      const res: GetUserResponse = new GetUserResponse();
      this.logger.log(`fetch user by given property`, trackingId);
      const result = await this.userService.findUser(
        documentNumber,
        phoneNumber,
        accountNumber,
        email,
        id,
      );
      this.logger.log(`user fetched for given property`, trackingId);
      if (!result.error) {
        res.data = {
          ...result,
        };
      } else
        res.error = {
          code: result.error,
          message: 'Usuario no encontrado',
        };
      return res;
    } catch (error) {
      if (error instanceof CustomException) throw error;
      console.error(error);
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @Version('1')
  @Post('exist')
  @ApiOperation({
    summary: 'Get user by account number or phone number',
  })
  @ApiOkResponse({
    description: 'Successfully fetched user',
    schema: {
      example: {
        data: { phoneNumber: 'string', accountNumber: ['string'] },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        error: { code: 'string', message: 'string' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: {
      example: {
        message: 'Something went wrong',
        statusCode: 500,
        errors: [
          {
            reason: 'internal_server_error',
            details: 'Service request failed with status code 500',
            code: 2000,
            source: 'system',
          },
        ],
      },
    },
  })
  async validateUserExist(
    @Body() { accountNumber, phoneNumber }: ValdiateUserExistDto,
    @Res() response: Response,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ) {
    try {
      this.logger.log(headers);
      const result = await this.userService.validateUserExist(
        accountNumber,
        phoneNumber,
      );

      response.status(HttpStatus.OK).send({
        data: {
          ...result,
        },
      });
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.UPDATE_USER,
      actorType: ActorType.USER,
    },
    requestMap: {
      'body.email': 'actorId',
      'body.trackingId': 'trackingId',
      'body.userData': 'executionContext.userData',
    },
    outputMap: {},
  })
  @Put()
  @ApiOperation({
    summary: 'Update a user',
  })
  @ApiOkResponse({
    description: 'User has been updated successfully',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async updateUser(
    @Body()
    { email, trackingId, ...userData }: UpdateUserDto,
  ) {
    try {
      this.logger.log(`update user for given emailId`, trackingId);
      this.logger.debug(
        `update user: ${JSON.stringify(userData)} email: ${email}`,
        trackingId,
      );
      await this.userService.updateUserByEmail(email, userData);

      this.logger.log(`user updated for given emailId`, trackingId);

      this.logger.debug(
        `email: ${email} ${JSON.stringify(userData)}`,
        trackingId,
      );
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalities.UPDATE_PHONE_NUMBER,
      actorType: ActorType.USER,
    },
    requestMap: {
      'body.phoneNumber': 'actorId',
      'body.trackingId': 'trackingId',
    },
    outputMap: {
      requestId: 'executionContext.requestId',
    },
  })
  @ApiOperation({
    summary: 'Update phone number and trigger verification',
  })
  @ApiOkResponse({
    type: UpdatePhoneNumberResponse,
    description:
      'Phone number updated and verification process triggered successfully',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Put('phone-number')
  async updatePhoneNumber(
    @Body() { phoneNumber, trackingId, userId }: UpdatePhoneNumberDto,
  ): Promise<UpdatePhoneNumberResponse> {
    try {
      this.logger.log('update phone number for user', trackingId);

      await this.userService.updateUserById(userId, {
        phoneNumber,
        phoneNumberVerified: false,
      });

      this.logger.log('phone number updated for user', trackingId);

      const requestId = uuidv4();

      this.logger.log(
        'trigger phone number verification for the user',
        trackingId,
      );

      await publishToQueue(this.kafkaClient, {
        topic: OTP_REQUEST_OTP_VERIFICATION,
        headers: {
          source: 'leap-x/user-service',
          timestamp: new Date().toISOString(),
        },
        value: {
          requestId,
          phoneNumber,
          trackingId,
          actionEvent: OtpActionEvents.PHONE_NUMBER_VERIFICATION,
        },
      });

      this.logger.log(
        'phone number verification process triggered for the user',
        trackingId,
      );
      return { requestId };
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }
  @Put('device')
  async updateDevice(
    @Body() { deviceId, trackingId, userId }: UpdateDeviceDto,
  ): Promise<UpdateDeviceDataResponse> {
    try {
      this.logger.log('update deviceId for user', trackingId);

      await this.userService.updateUserById(userId, {
        deviceId,
      });

      this.logger.log('deviceId updated for user', trackingId);

      return { data: { userId, deviceId } };
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS017, error);
    }
  }

  @EventPattern(IDNV_INFO_CHECKS_COMPLETED_TOPIC)
  async handleIdnvStatusUpdate(message) {
    const { userId, idnvStatus, riskProfile, trackingId } = message.value;

    try {
      this.logger.log(
        `update user with idnv status: userId ${userId} result ${idnvStatus} riskProfile ${riskProfile}`,
        trackingId,
      );

      //update user status based on kyc check result
      const userStatus = USER_STATUS_MAPPING[idnvStatus];
      await this.userService.updateUserById(userId, {
        status: userStatus,
        riskProfile: riskProfile,
      });

      this.logger.log(
        `updated user with idnv status: userId ${userId} result ${idnvStatus} riskProfile ${riskProfile}`,
        trackingId,
      );
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @Post('deposit')
  @ApiOperation({
    summary: 'Add User Deposit',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async AddUserDeposit(
    @Body() { userId, accountNumber, trackingId }: AddUserDepositDto,
  ) {
    try {
      this.logger.log(`add user deposit  for given emailId`, trackingId);
      await this.userService.AddUserDeposit({
        userId,
        accountNumber,
      });
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @Post()
  @Version('1')
  @ApiOperation({
    summary: 'Create User',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  async createUser(
    @Body() user: CreateUserRequestDto,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<CreateUserDataResponseDto> {
    try {
      this.logger.log(
        `create user: body: ${JSON.stringify(user)}, Headers:  ${JSON.stringify(
          headers,
        )}`,
        headers.TransactionId,
      );

      const result = await this.userService.createUser(user, headers);

      this.logger.log(
        `user create: Body: ${JSON.stringify(result)}`,
        headers.TransactionId,
      );
      return result;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @Put('locate/:phoneNumber')
  @ApiOperation({
    summary: 'update locate by phoneNumber',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Version('1')
  async updateLocateUser(
    @Body() updateLocation: UpdateLocateDto,
    @Param('phoneNumber') phoneNumber: string,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<UpdateLocateUserResponseData> {
    try {
      this.logger.log(
        `update locate user: body: ${JSON.stringify(
          updateLocation,
        )}, Headers:  ${JSON.stringify(headers)}`,
      );
      this.logger.log('update locate for  user', phoneNumber);
      const response =
        await this.userService.updateCityAndDepartamentByPhoneNumber(
          phoneNumber,
          updateLocation,
        );
      this.logger.log('locate updated for user', phoneNumber);
      return { data: response.message };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MUS022, error);
    }
  }
  @Get('/:userId/requirements')
  @ApiOperation({
    summary: 'requirements for this user',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Version('1')
  async requirementsUser(
    @Param('userId') userId: string,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<RequirementsUserResponseData> {
    try {
      this.logger.log(
        `userId : ${JSON.stringify(userId)}, Headers:  ${JSON.stringify(
          headers,
        )}`,
        headers.TransactionId,
      );
      return await this.userService.requirementsUser(userId);
    } catch (error) {
      this.logger.error(
        `Error en controlador requirementsUser `,
        error,
        headers.TransactionId,
      );
      throw error;
    }
  }
}
