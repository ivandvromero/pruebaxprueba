//Libraries
import { Injectable } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

//dto
import { CrmDataClient } from '../dto/crm.dto';
import { MessageEvent } from '../../dto/content.dto';
import {
  DeviceDataResponse,
  DetailtDeviceDataResponse,
} from '../enrollment-natural-person/dto/device-response.dto';
import { DeviceDto } from '../../modules/monitor/dto/device.dto';
import { TramaResponseData } from '../../modules/monitor/dto/trama-response-data.dto';

//util
import {
  validateData,
  transformDate,
  transformTime,
  formatDataClient,
  formatDataProduct,
  formatDataCreationDate,
} from '../../utils/transform-class';

//Interfaces
import { ProviderStrategy } from './provider-strategy.interface';

//Providers
import { CrmService } from '../crm/crm.service';
import { UserService } from '../user/user.service';
import { DaleNotificationService } from '../dale/services/dale-notification.service';
import { EnrollmentNaturalPersonService } from '../enrollment-natural-person/enrollment-np.service';
import { CardService } from '../card/card.service';

//Error Handling
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Enums
import { ErrorCodesEnum } from '../../shared/manage-errors/code-erros/error-codes.enum';

//Transform Data
import { HeadTransform } from '../../shared/manage-transform/class-transform/headTransform';
import { DeviceTransform } from '../../shared/manage-transform/class-transform/deviceTransform';
import { FutureUseTransform } from '../../shared/manage-transform/class-transform/futureUseTransform';
import { TransactionTransform } from '../../shared/manage-transform/class-transform/transactionTransform';
import { ClientOriginTransform } from '../../shared/manage-transform/class-transform/clientOriginTransform';
import { ProductOriginTransform } from '../../shared/manage-transform/class-transform/productOriginTransform';
import { ClientDestinationTransform } from '../../shared/manage-transform/class-transform/clientDestinationTransform';
import { ProductDestinationTransform } from '../../shared/manage-transform/class-transform/productDestinationTransform';

//Constants
import { transactionTypeStrategies } from '../../modules/monitor/constants/api';
import { HEADERS } from '../../shared/constants/headers';

export interface BaseTransform {
  headTrama: HeadTransform;
  clientOriginTransform: ClientOriginTransform;
  clientDestinationTransform: ClientDestinationTransform;
  productOriginTransform: ProductOriginTransform;
  productDestinationTransform: ProductDestinationTransform;
  transactionTransform: TransactionTransform;
  deviceTransform: DeviceTransform;
  futureUseTransform: FutureUseTransform;
}

@Injectable()
export class ProviderContext {
  constructor(
    private readonly enrollmentNaturalPersonService: EnrollmentNaturalPersonService,
    private readonly crmService: CrmService,
    private readonly userService: UserService,
    private readonly daleNotificationService: DaleNotificationService,
    private readonly cardService: CardService,
  ) {}
  public strategy: ProviderStrategy;
  setStrategy(transactionType: string): ProviderStrategy {
    this.strategy = new transactionTypeStrategies[transactionType](
      this.crmService,
      this.daleNotificationService,
    );
    return this.strategy;
  }

  async generateStructure(eventObject: MessageEvent): Promise<string> {
    let headTrama = this.getHead(eventObject);

    // getDevice
    let deviceTransform = new DeviceTransform();
    const ordererUser = await this.userService.getUser(
      this.strategy.getOrderer(eventObject).cellPhone.replace(/-/g, ''),
    );
    const deviceData = await this.getDevice(
      ordererUser.data.enrollmentId,
      this.strategy.getOrderer(eventObject).cellPhone.replace(/-/g, ''),
      eventObject,
    );
    deviceTransform = Object.assign(deviceTransform, deviceData);

    // Client Origin
    const ordererExternalId = this.strategy.getOrderer(eventObject).externalId;
    const getClientOrigin = await this.getClientOrigin(
      ordererExternalId,
      ordererUser.data.id,
    );
    let clientOriginTransform = getClientOrigin.clientOrigin;

    // Client Destination
    let clientDestinationTransform = new ClientDestinationTransform();
    const getClientDestination = await this.getClientDestination(
      this.strategy.getBeneficiary(eventObject).externalId,
      eventObject,
      this.strategy,
    );
    clientDestinationTransform = Object.assign(
      clientDestinationTransform,
      getClientDestination.clientDestination,
    );

    // Product origin
    const getProductOrigin = await this.getProductOrigin(
      this.strategy.getOrderer(eventObject).externalId,
      eventObject,
      getClientOrigin,
    );
    let productOriginTransform = new ProductOriginTransform();
    productOriginTransform = Object.assign(
      productOriginTransform,
      getProductOrigin.productOrigin,
    );

    // Product destination
    let productDestinationTransform = new ProductDestinationTransform();
    const getProductDestination = await this.getProductDestination(
      eventObject,
      getClientDestination,
      this.strategy,
    );
    productDestinationTransform = Object.assign(
      productDestinationTransform,
      getProductDestination.productDestination,
    );

    // Transaction
    let transactionTransform = new TransactionTransform();
    const transactionData = await this.getTransaction(eventObject);
    transactionTransform = Object.assign(transactionTransform, transactionData);

    let futureUseTransform = new FutureUseTransform();
    const futureUseData = this.getFutureUse(eventObject);
    futureUseTransform = Object.assign(futureUseTransform, futureUseData);

    const baseTrama = {
      headTrama,
      clientOriginTransform,
      clientDestinationTransform,
      productOriginTransform,
      productDestinationTransform,
      transactionTransform,
      futureUseTransform,
      deviceTransform,
    } as BaseTransform;
    const result: BaseTransform = await this.strategy.doAlgorithm(
      baseTrama,
      eventObject,
    );

    headTrama = Object.assign(headTrama, result.headTrama);
    const headTramaToPlain = instanceToPlain(headTrama);
    const joinedheadTrama = Object.values(headTramaToPlain).join('');

    clientOriginTransform = Object.assign(
      clientOriginTransform,
      result.clientOriginTransform,
    );
    const clientOriginToPlain = instanceToPlain(clientOriginTransform);
    const joinedClientOrigin = Object.values(clientOriginToPlain).join('');

    const clientDestinationToPlain = instanceToPlain(
      clientDestinationTransform,
    );
    const joinedClientDestination = Object.values(
      clientDestinationToPlain,
    ).join('');

    productOriginTransform = Object.assign(
      productOriginTransform,
      result.productOriginTransform,
    );
    const productOriginToPlain = instanceToPlain(productOriginTransform);
    const joinedProductOrigin = Object.values(productOriginToPlain).join('');

    const productDestinationToPlain = instanceToPlain(
      productDestinationTransform,
    );
    const joinedProductDestination = Object.values(
      productDestinationToPlain,
    ).join('');

    transactionTransform = Object.assign(
      transactionTransform,
      result.transactionTransform,
    );
    const transactionToPlain = instanceToPlain(transactionTransform);
    const joinedTransaction = Object.values(transactionToPlain).join('');

    futureUseTransform = Object.assign(
      futureUseTransform,
      result.futureUseTransform,
    );
    const futureUseToPlain = instanceToPlain(futureUseTransform);
    const joinedfutureUse = Object.values(futureUseToPlain).join('');

    deviceTransform = Object.assign(deviceTransform, result.deviceTransform);
    const deviceToPlain = instanceToPlain(deviceTransform);
    const joinedDevice = Object.values(deviceToPlain).join('');

    await validateData(TramaResponseData, {
      head: headTramaToPlain,
      clientOrigin: clientOriginToPlain,
      clientDestination: clientDestinationToPlain,
      productOrigin: productOriginToPlain,
      producDestination: productDestinationToPlain,
      transaction: transactionToPlain,
      futureUse: futureUseToPlain,
    });
    const trama =
      joinedheadTrama +
      joinedClientOrigin +
      joinedClientDestination +
      joinedProductOrigin +
      joinedProductDestination +
      joinedTransaction +
      joinedDevice +
      joinedfutureUse;
    return trama;
  }
  getHead(eventObject) {
    const result = formatDataCreationDate(eventObject);

    const transactionDatetime = new Date(result.data.creationDate);
    const headTrama = new HeadTransform();
    headTrama.Field_VWJEFECHAD = transactionDatetime.getDate();
    headTrama.Field_VWJEFECHAM = transactionDatetime.getMonth() + 1;
    headTrama.Field_VWJEFECHAA = transactionDatetime.getUTCFullYear();
    headTrama.Field_VWJEHORA = transactionDatetime.getHours();
    headTrama.Field_SISTEMINUTE = transactionDatetime.getMinutes();
    return headTrama;
  }
  async getClientOrigin(externalId: string, userId: string) {
    try {
      let client = await this.crmService.getClientOrigin(externalId);
      let links = [];

      client.PersonDEO_dl_peps_c = '00'; //TODO: llega vacio, eliminar despues
      // Validate data
      await validateData(CrmDataClient, client);

      // Format data
      client = formatDataClient(client);

      links = client.links;
      const tipo_enrrolamiento = client.PersonDEO_dl_tipo_enrrolamiento_c;

      const cardBasic = await this.cardService.getCardAddress(userId);

      const clientOrigin = new ClientOriginTransform();
      clientOrigin.Field_K7_0001 = client.PartyId;
      clientOrigin.Field_K7_0002 = client.PartyType;
      clientOrigin.Field_K7_0003 = client.PersonDEO_dl_tipo_identificacion_c;
      clientOrigin.Field_K7_0004 = client.PersonDEO_dl_numero_identificacion_c;
      clientOrigin.Field_K7_0005 = client.ContactName;
      clientOrigin.Field_K7_0006 = client.EmailAddress ?? '';
      clientOrigin.Field_K7_0007 = client.MobileNumber ?? '';
      clientOrigin.Field_K7_0008 = cardBasic?.data?.address ?? '';
      clientOrigin.Field_K7_0009 = client.CreationDate;
      clientOrigin.Field_K7_0011 = client.PersonDEO_dl_fecha_expedicion_c;
      clientOrigin.Field_K7_0012 = client.PersonDEO_dl_peps_c;
      clientOrigin.Field_K7_0014 = client.Country;
      clientOrigin.Field_K7_0015 = cardBasic?.data?.cityDaneCode ?? '';
      clientOrigin.Field_K7_0016 = cardBasic?.data?.departmentDaneCode ?? '';
      clientOrigin.Field_K7_0018 = client.SalesProfileStatus;
      clientOrigin.Field_K7_0019 = client.CreationDate;
      clientOrigin.Field_K7_0020 = client.CreationDate;
      clientOrigin.Field_K7_0027 = client.PersonDEO_dl_genero_c;

      const dataClient = {
        clientOrigin,
        links,
        tipo_enrrolamiento,
      };
      return dataClient;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON003, error);
    }
  }
  async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
    strategy: ProviderStrategy,
  ) {
    try {
      const dataClient = await strategy.getClientDestination(
        externalId,
        eventObject,
      );
      return dataClient;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON004, error);
    }
  }
  async getProductOrigin(
    externalId: string,
    eventObject: MessageEvent,
    clientOrigin,
  ) {
    try {
      const deposit = await this.crmService.getProductOrigin(
        externalId,
        clientOrigin,
      );
      let [product] = deposit.items.length !== 0 ? deposit.items : [{}];
      product = formatDataProduct(product);
      const productOrigin = new ProductOriginTransform();
      productOrigin.Field_K7_0060 = 'DE2'; //DE2 para dale 2.0 - DPE - para dale 1
      productOrigin.Field_K7_0062 = clientOrigin.tipo_enrrolamiento;
      productOrigin.Field_K7_0063 = '172002'; //DALE 1: 170000  - DALE 2: 172002
      productOrigin.Field_K7_0064 =
        eventObject.CFO.orderer.account.othersId.identificationId;
      productOrigin.Field_K7_0065 = product.creationDate;
      const [bodyRSresponses] = eventObject.RS.messageRS.responses;
      const [confirmations] = bodyRSresponses.confirmations;
      const accountBalances = confirmations?.data?.accountBalances?.totalBalance
        ? confirmations.data.accountBalances.totalBalance
        : '';
      productOrigin.Field_K7_0066 = Number(accountBalances);
      productOrigin.Field_K7_0067 = product.dl_estado_deposito_c;
      const dataProduct = {
        productOrigin,
      };
      return dataProduct;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON005, error);
    }
  }
  async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
    strategy: ProviderStrategy,
  ) {
    try {
      const dataProduct = await strategy.getProductDestination(
        eventObject,
        clientDestination,
      );
      return dataProduct;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON006, error);
    }
  }
  async getTransaction(eventObject) {
    const [bodyRSresponses] = eventObject.RS.messageRS.responses;
    const result = formatDataCreationDate(eventObject);

    const creationDate = new Date(result.data.creationDate);
    const creationDateOneDay = new Date(result.data.creationDate);
    creationDateOneDay.setDate(creationDateOneDay.getDate() + 1);
    const transactionTransform = new TransactionTransform();
    transactionTransform.Field_K7_0087 = transformDate(creationDate);
    transactionTransform.Field_K7_0088 = transformDate(creationDateOneDay);
    transactionTransform.Field_K7_0089 = transformTime(creationDate);
    transactionTransform.Field_K7_0090 = bodyRSresponses.PTSId;
    const transactionAmount = eventObject.CFO.general.transactionAmount;
    transactionTransform.Field_K7_0094 = transactionAmount;
    transactionTransform.Field_K7_0096 = transactionAmount;
    transactionTransform.Field_K7_0097 = transactionAmount;
    transactionTransform.Field_K7_0099 =
      eventObject.RS.statusRS.code === '0' ? 'E' : 'D';
    transactionTransform.Field_K7_0100 =
      eventObject.RS.statusRS.code === '0' ? '10' : '13';
    transactionTransform.Field_K7_0101 =
      eventObject.RS.statusRS.code === '0' ? 'Exitoso' : 'Fallido';

    return transactionTransform;
  }
  async getDevice(
    enrollmentPN_id: string,
    cellPhone: string,
    eventObject: MessageEvent,
  ): Promise<DeviceDataResponse> {
    try {
      // Device
      const getDeviceData =
        await this.enrollmentNaturalPersonService.getDeviceInformation(
          enrollmentPN_id,
          HEADERS,
        );
      await validateData(DetailtDeviceDataResponse, getDeviceData);
      const deviceId = getDeviceData.data.device.deviceId
        .replace(/-/g, '')
        .slice(-20);
      const deviceData = {
        Field_K7_0110: deviceId,
        Field_K7_0111: getDeviceData.data.device.deviceName.substring(0, 20),
        Field_K7_0112: getDeviceData.data.device.deviceVersion,
        Field_K7_0113: eventObject.RQ.securityRQ?.hostId ?? '0.0.0.0',
        Field_K7_0118: getDeviceData.data.device.deviceAppInfo.substring(0, 60),
        Field_K7_0119: getDeviceData.data.device.deviceOperativeSystem,
        Field_K7_0132: Number(cellPhone),
      };
      let deviceTransform = new DeviceTransform();
      deviceTransform = Object.assign(deviceTransform, deviceData);

      const deviceToPlain = instanceToPlain(deviceTransform);
      await validateData(DeviceDto, deviceToPlain);

      return deviceData;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON008, error);
    }
  }
  getFutureUse(eventObject: MessageEvent): FutureUseTransform {
    const futureUseTransform = new FutureUseTransform();
    futureUseTransform.Field_K7_0143 = eventObject.RS.statusRS.code;
    return futureUseTransform;
  }
}
