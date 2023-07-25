//Libraries
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';
import {
  validateData,
  formatDataClient,
  formatDataProduct,
} from '../../../utils/transform-class';
import { Injectable } from '@nestjs/common';

//Enums
import { TypeTransactionPts } from '../../../config/env/env.config';
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';

//Interfaces
import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../../dto/content.dto';
import { CrmDataClient } from '../../../providers/dto/crm.dto';
import { BP, OrdererBP } from '../../../dto/message-event-CFO.dto';
import { Key } from '../../../providers/dale/dto/dale-notification.dto';

//Transforms
import { ClientDestinationTransform } from '../../../shared/manage-transform/class-transform/clientDestinationTransform';
import { ProductDestinationTransform } from '../../../shared/manage-transform/class-transform/productDestinationTransform';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

//Constants
import { credit_ordinals } from '../../../modules/eventlog/constants/api';

@Injectable()
export class IntrasolutionStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
  ) {}
  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    try {
      // default data to intrasolution
      const [bodyResponsesRS] = eventObject.RS.messageRS.responses;
      const confirmations = bodyResponsesRS.confirmations;
      const [debitInfo] = confirmations
        .filter((confirm) => confirm.data.amount < 0)
        .sort((a, b) => (a.data.id > b.data.id ? -1 : 0));
      const accountBalance = debitInfo.data.accountBalances.totalBalance;
      data.productOriginTransform.Field_K7_0066 = Number(accountBalance);
      data.transactionTransform.Field_K7_0091 = 'Intrasolucion';
      data.transactionTransform.Field_K7_0092 =
        TypeTransactionPts.INT_TRAN_DO_DALE2;
      data.transactionTransform.Field_K7_0102 = this.getIsReverse(eventObject)
        ? 'S'
        : 'N';
      data.transactionTransform.Field_K7_0104 = eventObject.CFO.general
        .transactionDetails
        ? eventObject.CFO.general.transactionDetails
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .substring(0, 20)
        : '';
      await this.sendSmsNotification(eventObject);
      return data;
    } catch (error) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON009, error);
    }
  }
  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    try {
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      const depositDestination = await this.crmService.getProductDestination(
        beneficiaries.additionals.beneficiary.BP.externalId,
        clientDestination,
      );
      let [product] =
        depositDestination.items.length !== 0 ? depositDestination.items : [{}];
      product = formatDataProduct(product);
      const productDestination = new ProductDestinationTransform();
      productDestination.Field_K7_0072 = 'DE2';
      productDestination.Field_K7_0074 = clientDestination.tipo_enrrolamiento;
      productDestination.Field_K7_0075 = '172002';
      productDestination.Field_K7_0076 =
        beneficiaries.additionals.beneficiary.BP.cellPhone;
      productDestination.Field_K7_0077 = Number(product.creationDate);
      const [bodyRSresponses] = eventObject.RS.messageRS.responses;
      const confirmations = bodyRSresponses.confirmations;
      const [creditData] = confirmations.filter(
        (confirm) => confirm.data.amount > 0,
      );
      const accountBalances = creditData.data.accountBalances.totalBalance;
      productDestination.Field_K7_0078 = Number(accountBalances);
      productDestination.Field_K7_0079 = product.dl_estado_deposito_c;
      const dataProduct = {
        productDestination,
      };
      return dataProduct;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON006, error);
    }
  }

  async getClientDestination(externalId: string, eventObject: MessageEvent) {
    try {
      let client = await this.crmService.getClientDestination(externalId);
      let links = [];

      client.PersonDEO_dl_peps_c = '00'; //TODO: llega vacio, eliminar despues
      // Validate data
      await validateData(CrmDataClient, client);

      // Format data
      client = formatDataClient(client);

      links = client.links;
      const tipo_enrrolamiento = client.PersonDEO_dl_tipo_enrrolamiento_c;
      const beneficiary = this.getBeneficiary(eventObject);

      const clientDestination = new ClientDestinationTransform();
      clientDestination.Field_K7_0031 = client.PartyId;
      clientDestination.Field_K7_0032 =
        client.PersonDEO_dl_tipo_identificacion_c;
      clientDestination.Field_K7_0033 =
        client.PersonDEO_dl_numero_identificacion_c;
      clientDestination.Field_K7_0034 = client.ContactName;
      clientDestination.Field_K7_0035 = client.EmailAddress ?? '';
      clientDestination.Field_K7_0036 =
        client.MobileNumber ?? beneficiary.cellPhone;
      clientDestination.Field_K7_0038 = Number(client.CreationDate);
      clientDestination.Field_K7_0040 = Number(
        client.PersonDEO_dl_fecha_expedicion_c,
      );
      clientDestination.Field_K7_0041 = client.PersonDEO_dl_peps_c;
      clientDestination.Field_K7_0043 = client.Country;
      clientDestination.Field_K7_0047 = client.SalesProfileStatus;
      clientDestination.Field_K7_0049 = Number(client.CreationDate);
      clientDestination.Field_K7_0056 = client.PersonDEO_dl_genero_c;

      const dataClient = {
        clientDestination,
        links,
        tipo_enrrolamiento,
      };
      return dataClient;
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON004, error);
    }
  }

  public getOrderer(eventObject: MessageEvent): OrdererBP {
    return eventObject.CFO.orderer.additionals.ordererBP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP;
  }

  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const statusRS = eventObject.RS.statusRS;
    if (statusRS.code === '0') {
      const amount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponses] = eventObject.RS.messageRS.responses;
      const confirmations = bodyRSresponses.confirmations;
      const [debitInfo] = confirmations
        .filter((confirm) => confirm.data.amount < 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const debitDate = this.daleNotificationService.getDateInformation(
        debitInfo.data.creationDate,
      );
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      const beneficiaryName = beneficiaries.additionals.beneficiary.BP?.name;
      const beneficiaryCellPhone =
        beneficiaries.additionals.beneficiary.BP.cellPhone.replace(/-/g, '');
      const debitKeys: Key[] = this.daleNotificationService.getSmsKeys(
        amount,
        debitDate,
        beneficiaryName,
      );
      const [creditInfo] = confirmations
        .filter((confirm) => confirm.data.amount > 0)
        .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
      const creditDate = this.daleNotificationService.getDateInformation(
        creditInfo.data.creationDate,
      );
      const ordererName = eventObject.CFO.orderer.additionals.ordererBP.name;
      const ordererCellPhone =
        eventObject.CFO.orderer.additionals.ordererBP.cellPhone.replace(
          /-/g,
          '',
        );
      const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
        amount,
        creditDate,
        ordererName,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        ordererCellPhone,
        false,
        '011',
        debitKeys,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiaryCellPhone,
        false,
        '012',
        creditKeys,
      );
    }
  }
  getIsReverse(eventObject) {
    const [bodyResponsesRS] = eventObject.RS.messageRS.responses;
    const confirmations = bodyResponsesRS.confirmations;
    const result = confirmations.filter((confirm) =>
      credit_ordinals.includes(confirm.ordinal),
    );
    return result.length === 0 ? false : true;
  }
}
