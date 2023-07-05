import {
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { Headers } from '../../shared/decorators/headers-swagger.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Version,
  Query,
} from '@nestjs/common';
import { UserFavoritesService } from './user-favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { ConditionalAuditCreator } from '@dale/shared-nestjs/utils/audit/audit-creator';
import { functionalitiesFavorites } from '../../constants/common';
import { ActorType } from '@dale/shared-nestjs/utils/audit/types';
import { Favorite } from '../../db/favorite/favorite.entity';
import { INVALID_PAYLOAD_ERROR } from '@dale/shared-nestjs/constants/errors';
import { RequestHeader } from '../../shared/decorators/headers.decorator';
import { HeaderDTO } from '../../shared/dto/header.dto';
import { Logger } from '@dale/logger-nestjs';
import { ErrorCodesEnum } from '../../shared/code-erros/error-codes.enum';
import { BadRequestExceptionDale } from '@dale/manage-errors-nestjs';

@Headers()
@ApiTags('user-favorites')
@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'please select a version',
  required: true,
})
@Controller()
export class UserFavoriteController {
  constructor(
    private readonly favoritesService: UserFavoritesService,
    private logger: Logger,
  ) {}

  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalitiesFavorites.CREATE__FAVORITE_USER,
      actorType: ActorType.USER,
    },
    requestMap: {
      'body.userId': 'userId',
      'body.favoriteAlias': 'favoriteAlias',
      'body.phoneNumber': 'phoneNumber',
    },
    outputMap: {
      'result.id': 'executionContext.favoriteUserId',
    },
  })
  @ApiOperation({
    summary: 'Create new favorite',
  })
  @ApiCreatedResponse({
    type: Favorite,
    description: 'New favorite created successfully',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Version('1')
  @Post('user/favorite')
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<Favorite> {
    try {
      this.logger.log(headers);
      return await this.favoritesService.create(createFavoriteDto, headers);
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalitiesFavorites.GET_FAVORITE_USER,
      actorType: ActorType.USER,
    },
    requestMap: {
      'query.userId': 'actorId',
    },
    outputMap: {
      'result.': 'executionContext.favoriteUser',
    },
  })
  @ApiOperation({
    summary: 'Get favorite by userId',
  })
  @ApiOkResponse({
    type: Favorite,
    description: 'Successfully fetched favorite',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Version('1')
  @Get('user/:userId?/favorites')
  async findAllById(
    @Param('userId') userId: string,
    @Query('filter') filter: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<Favorite[]> {
    try {
      this.logger.log(headers);
      return await this.favoritesService.findAllByUserId(
        userId,
        filter,
        limit,
        offset,
      );
    } catch (error) {
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }

  @ConditionalAuditCreator({
    executionContext: {
      functionality: functionalitiesFavorites.DELETE_FAVORITE_USER,
      actorType: ActorType.USER,
    },
    requestMap: {
      'query.Id': 'tableId',
    },
    outputMap: {
      'result.': 'executionContext.favoriteUser',
    },
  })
  @ApiOperation({
    summary: 'Delete favorite by Id',
  })
  @ApiOkResponse({
    type: Favorite,
    description: 'Successfully remove favorite',
  })
  @ApiBadRequestResponse({
    description: INVALID_PAYLOAD_ERROR,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Version('1')
  @Delete('user/:userId/favorite/:favoriteId')
  async remove(
    @Param('userId') userId: string,
    @Param('favoriteId') favoriteId: string,
    @RequestHeader(HeaderDTO) headers: HeaderDTO,
  ): Promise<void> {
    try {
      this.logger.log(headers);
      return await this.favoritesService.remove(favoriteId, userId, headers);
    } catch (error) {
      const errorResponse = error.getResponse();
      if (errorResponse['code']) {
        throw new BadRequestExceptionDale(errorResponse['code'], error);
      }
      throw new BadRequestExceptionDale(ErrorCodesEnum.MUS000, error);
    }
  }
}
