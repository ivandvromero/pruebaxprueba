//Libraries
import { Injectable } from '@nestjs/common';

//Providers
import { CrmService } from '../../../providers/crm/crm.service';
import { CardService } from '../../../providers/card/card.service';
import { DaleNotificationService } from '../../../providers/dale/services/dale-notification.service';

//Interfaces
import { BaseTransform } from '../../../providers/context/provider-context';
import { ProviderStrategy } from '../../../providers/context/provider-strategy.interface';

//Data Transfer Objects (DTO)
import { MessageEvent } from '../../../dto/content.dto';
import { CrmDataClient } from '../../../providers/dto/crm.dto';
import {
  AdditionalsOrderer,
  BP,
  OrdererBP,
} from '../../../dto/message-event-CFO.dto';
import {
  Key,
  DateInfo,
} from '../../../providers/dale/dto/dale-notification.dto';

//Class transform
import { DeviceTransform } from '../../../shared/manage-transform/class-transform/deviceTransform';
import { ClientOriginTransform } from '../../../shared/manage-transform/class-transform/clientOriginTransform';
import { ProductOriginTransform } from '../../../shared/manage-transform/class-transform/productOriginTransform';
import { ClientDestinationTransform } from '../../../shared/manage-transform/class-transform/clientDestinationTransform';
import { ProductDestinationTransform } from '../../../shared/manage-transform/class-transform/productDestinationTransform';
import {
  formatDataClient,
  formatDataCreationDate,
  formatDataProduct,
  validateData,
} from '../../../utils/transform-class';

//Error Codes
import { ErrorCodesEnum } from '../../../shared/manage-errors/code-erros/error-codes.enum';
import {
  CustomException,
  InternalServerExceptionDale,
} from '@dale/manage-errors-nestjs';

//Enum
import { CodeBanksEnum, DocumentType } from '../../../shared/enum/monitor.enum';

//Const
import { transactionTypes } from '../constants/api';
@Injectable()
export class TmaRecibirReversoStrategy implements ProviderStrategy {
  constructor(
    private crmService: CrmService,
    private daleNotificationService: DaleNotificationService,
    private cardService: CardService,
  ) {}

  public async doAlgorithm(
    data: BaseTransform,
    eventObject: MessageEvent,
  ): Promise<BaseTransform> {
    const result = formatDataCreationDate(eventObject);
    const { transactionType } = eventObject.CFO.general;
    const creationDate = new Date(result.data.creationDate);
    let additionals: AdditionalsOrderer;

    if (transactionType === transactionTypes.TMA_RECEIVE) {
      data.transactionTransform.Field_K7_0091 = 'Abono a deposit';
      additionals = eventObject.CFO.orderer.additionals;
    } else {
      data.transactionTransform.Field_K7_0091 = 'Reverso por dis';
      data.transactionTransform.Field_K7_0102 = 'S';
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      additionals = beneficiaries.additionals;
    }

    const { sourceDetails, S125_TD1, S125_DOC1 } = additionals;
    const { sourceAccount, sourceBankId, TypeProductOrigin } = sourceDetails;

    data.clientOriginTransform = new ClientOriginTransform();
    data.productOriginTransform = new ProductOriginTransform();
    data.deviceTransform = new DeviceTransform();

    data.clientOriginTransform.Field_K7_0001 = S125_DOC1;
    data.clientOriginTransform.Field_K7_0003 =
      DocumentType[S125_TD1] !== undefined ? DocumentType[S125_TD1] : '';
    data.clientOriginTransform.Field_K7_0004 = S125_DOC1;
    data.productOriginTransform.Field_K7_0060 = TypeProductOrigin ?? ''; //Segun el evento no llega esta propiedad en la respuesta de PTS
    data.productOriginTransform.Field_K7_0063 =
      CodeBanksEnum[sourceBankId] !== undefined
        ? CodeBanksEnum[sourceBankId]
        : '';
    data.productOriginTransform.Field_K7_0064 = sourceAccount;
    data.transactionTransform.Field_K7_0092 = 'L2';
    data.transactionTransform.Field_K7_0098 = 'IN';
    data.deviceTransform.Field_K7_0121 = creationDate.toString();
    await this.sendSmsNotification(eventObject);

    return data;
  }

  public async getProductDestination(
    eventObject: MessageEvent,
    clientDestination,
  ) {
    try {
      let externalId: string;
      let cellPhone: string;
      const { transactionType } = eventObject.CFO.general;

      if (transactionType === transactionTypes.TMA_RECEIVE) {
        const [beneficiaries] = eventObject.CFO.beneficiaries;
        externalId = beneficiaries.additionals.beneficiary.BP.externalId;
        cellPhone = beneficiaries.additionals.beneficiary.BP.cellPhone;
      } else {
        externalId = eventObject.CFO.orderer.additionals.ordererBP.externalId;
        cellPhone = eventObject.CFO.orderer.additionals.ordererBP.cellPhone;
      }

      const depositDest = await this.crmService.getProductDestination(
        externalId,
        clientDestination,
      );
      let [products] =
        depositDest.items.length !== 0 ? depositDest.items : [{}];
      products = formatDataProduct(products);
      const productDestination = new ProductDestinationTransform();
      productDestination.Field_K7_0072 = 'DE2';
      productDestination.Field_K7_0074 = clientDestination.tipo_enrrolamiento;
      productDestination.Field_K7_0075 = '172002';
      productDestination.Field_K7_0076 = cellPhone;
      productDestination.Field_K7_0077 = Number(products.creationDate);
      const [responses] = eventObject.RS.messageRS.responses;
      const confirmationsRS = responses.confirmations;
      const [confirmationsFilter] = confirmationsRS.filter(
        (confirm) => confirm.data.amount > 0,
      );
      const balances = confirmationsFilter.data.accountBalances.totalBalance;
      productDestination.Field_K7_0078 = Number(balances);
      productDestination.Field_K7_0079 = products.dl_estado_deposito_c;

      return {
        productDestination,
      };
    } catch (error) {
      if (error instanceof CustomException) {
        throw error;
      }
      throw new InternalServerExceptionDale(ErrorCodesEnum.MON006, error);
    }
  }
  public async getClientDestination(
    externalId: string,
    eventObject: MessageEvent,
    userId: string,
  ) {
    try {
      let client = await this.crmService.getClientDestination(externalId);
      let links = [];

      client.PersonDEO_dl_peps_c = '00';
      // Validate data
      await validateData(CrmDataClient, client);

      // Format data
      client = formatDataClient(client);

      links = client.links;
      const tipo_enrrolamiento = client.PersonDEO_dl_tipo_enrrolamiento_c;

      const cardBasic = await this.cardService.getCardAddress(userId);

      const clientDestination = new ClientDestinationTransform();
      clientDestination.Field_K7_0031 = client.PartyId;
      clientDestination.Field_K7_0032 =
        client.PersonDEO_dl_tipo_identificacion_c;
      clientDestination.Field_K7_0033 =
        client.PersonDEO_dl_numero_identificacion_c;
      clientDestination.Field_K7_0034 = client.ContactName;
      clientDestination.Field_K7_0035 = client.EmailAddress ?? '';
      clientDestination.Field_K7_0036 = client.MobileNumber ?? '';
      clientDestination.Field_K7_0037 = cardBasic?.data?.address ?? '';
      clientDestination.Field_K7_0038 = Number(client.CreationDate);
      clientDestination.Field_K7_0040 = Number(
        client.PersonDEO_dl_fecha_expedicion_c,
      );
      clientDestination.Field_K7_0041 = client.PersonDEO_dl_peps_c;
      clientDestination.Field_K7_0043 = client.Country;
      clientDestination.Field_K7_0044 = cardBasic?.data?.cityDaneCode ?? '';
      clientDestination.Field_K7_0045 =
        cardBasic?.data?.departmentDaneCode ?? '';
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
    const { transactionType } = eventObject.CFO.general;
    if (transactionType === transactionTypes.TMA_RECEIVE) {
      const [beneficiaries] = eventObject.CFO.beneficiaries;
      return beneficiaries.additionals.beneficiary.BP;
    }
    return eventObject.CFO.orderer.additionals.ordererBP;
  }

  public getBeneficiary(eventObject: MessageEvent): BP {
    const { transactionType } = eventObject.CFO.general;
    if (transactionType !== transactionTypes.TMA_RECEIVE) {
      return eventObject.CFO.orderer.additionals.ordererBP;
    }
    const [beneficiaries] = eventObject.CFO.beneficiaries;
    return beneficiaries.additionals.beneficiary.BP;
  }

  async sendSmsNotification(eventObject: MessageEvent): Promise<void> {
    const statusRS = eventObject.RS.statusRS;
    const { transactionType } = eventObject.CFO.general;
    if (statusRS.code === '0') {
      const amount = eventObject.CFO.general.transactionAmount;
      const [bodyRSresponses] = eventObject.RS.messageRS.responses;
      let creationDate: string;
      let notificationCode: string;

      if (transactionType === transactionTypes.TMA_RECEIVE) {
        const [creditInfo] = bodyRSresponses.confirmations
          .filter((confirm) => confirm.data.amount > 0)
          .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
        creationDate = creditInfo.data.creationDate;
        notificationCode = '017';
      } else {
        const [creditInfo] = bodyRSresponses.confirmations
          .filter((confirm) => confirm.data.amount < 0)
          .sort((a, b) => (a.data.id < b.data.id ? -1 : 0));
        creationDate = creditInfo.data.creationDate;
        notificationCode = '018';
      }

      const creditDate: DateInfo =
        this.daleNotificationService.getDateInformation(creationDate);

      const beneficiary = this.getOrderer(eventObject);
      const beneficiaryCellPhone = beneficiary.cellPhone.replace(/-/g, '');
      const creditKeys: Key[] = this.daleNotificationService.getSmsKeys(
        amount,
        creditDate,
      );
      await this.daleNotificationService.sendSmsNotification(
        eventObject,
        '57',
        beneficiaryCellPhone,
        false,
        notificationCode,
        creditKeys,
      );
    }
  }
}
