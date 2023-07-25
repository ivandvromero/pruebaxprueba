import {
  CacheInterceptor,
  CacheKey,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { ClientService } from '../services/client.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  BasicClientDto,
  ClientQuery,
  GetClientDto,
  GetTransactionChannelDto,
  TransactionChannelDto,
} from '../dto';
import { NaturalPersonQuery } from '../dto/natural-person-query.dto';
import { NaturalPersonDto } from '../../../shared/providers/crm-connector-adapter/dto/natural-person.dto';
import { CardDto } from '../../../shared/providers/crm-connector-adapter/dto/cards.dto';
import { IAccount } from '@dale/client/common/interfaces/account.interface';
import { AuditInterceptor } from '../../../shared/interceptors/audit.interceptor';
import { Auth0Guard } from '@dale/auth/auth.guard';
import { PermissionsGuard } from '@dale/auth/permission.guard';
import { Permissions } from '@dale/auth/permissions.decorator';

@ApiTags('Client')
@ApiHeader({
  name: 'ApiVersion',
  enum: ['1'],
  description: 'Please select a version',
  required: true,
})
@Controller('api/client')
@UseInterceptors(CacheInterceptor)
@UseInterceptors(AuditInterceptor)
@ApiBearerAuth()
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Version('1')
  @Get('') //!Todo change endpoint
  @ApiOperation({
    summary: 'Get client by search params',
    description:
      'This endpoint can be used for search for a client using different query params, all the values correspond to the info storage in mambu',
  })
  @ApiOkResponse({
    description: 'Client found successfully',
    type: GetClientDto,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('ConsultClient:read')
  async getClient(@Query() clientQuery: ClientQuery): Promise<BasicClientDto> {
    const dataClient = await this.clientService.getClientWithEnrollment(
      clientQuery,
    );
    return dataClient.client;
  }

  @Version('1')
  @Get('transactionCode')
  @CacheKey('transactionCodes')
  @ApiOperation({
    summary: 'Get all transaction chanels, code and description',
    description:
      'This endpoint can be used for obtain all the codes and description for the transaction channels, the response consist of a JSON array',
  })
  @ApiOkResponse({
    description: 'Transaction channels',
    type: TransactionChannelDto,
    isArray: true,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('TransactionCodes:read')
  async getTransactionCodes(): Promise<GetTransactionChannelDto> {
    return await this.clientService.getTransactionChanels();
  }

  @Version('1')
  @Get('/naturalPerson')
  @ApiOperation({
    summary:
      'Get natural person client by deposit number, identification or phone number',
    description:
      'This endpoint can be used for search for a client using different query params, all the values correspond to CRM info storage',
  })
  @ApiOkResponse({
    description: 'Natural person client found successfully',
    type: NaturalPersonDto,
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('NaturalPerson:read')
  async getNaturalPerson(
    @Query() naturalPersonQuery: NaturalPersonQuery,
  ): Promise<NaturalPersonDto> {
    return await this.clientService.getNaturalPerson(naturalPersonQuery);
  }

  @Version('1')
  @Get('/naturalPerson/:partyId/cards')
  @ApiOperation({
    summary: 'Get an array of cards by party number',
    description:
      'This endpoint can be used for search an array of cards by party number',
  })
  @ApiOkResponse({
    description: 'set of cards found successfully',
    type: [CardDto],
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('NaturalPersonCards:read')
  async getNaturalPersonCards(
    @Param('partyId') partyId: string,
  ): Promise<CardDto[]> {
    return await this.clientService.getNaturalPersonCards(partyId);
  }

  @Version('1')
  @Get('/naturalPerson/balance/:identification')
  @ApiOperation({
    summary: 'Get the balance of a client',
    description: 'This endpoint return the balance of a client',
  })
  @ApiOkResponse({
    description: 'set of cards found successfully',
    type: [CardDto],
  })
  @UseGuards(Auth0Guard, PermissionsGuard)
  @Permissions('NaturalPersonBalance:read')
  async getNaturalPersonBalance(
    @Param('identification') identification: string,
  ): Promise<IAccount> {
    return await this.clientService.getNaturalPersonBalance(identification);
  }
}
