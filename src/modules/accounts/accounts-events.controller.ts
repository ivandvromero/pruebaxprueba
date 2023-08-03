import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { KafkaTopicsConstants } from './constants/api';
import {
  AccountEventDto,
  AccountPTSEventDto,
  UpdateAccountEventDto,
} from './dto/accounts.dto';
import { AccountsService } from './accounts.service';
import { Logger } from '@dale/logger-nestjs';
import {
  clearObject,
  mapKafkaHeadersToDto,
} from 'src/shared/utils/map-kafka-headers-to-dto';
import serviceConfiguration from 'src/config/service-configuration';
import { EnrollmentStepActions } from 'src/shared/dtos/events.dto';
import { EnrollmentStatusEnum } from 'src/constants/common';

@Controller('accounts-events')
export class AccountsEventsController {
  constructor(
    private readonly accountService: AccountsService,
    private readonly logger: Logger,
  ) {}

  /**
   * Metodo encargado de escuchar los eventos del topico de kafka: account.create.account.pts
   * Se encarga de solicitar la creacion de la cuenta en PTS-MAMBU
   * Quinto evento de enrollment, el cual es disparado por user.update.user
   *
   * @param account - valores que se capturan del evento kafka
   * @param context - Contexto donde se captura los headers
   * @returns - un valor boolean si se proceso correctamente o no el evento
   */
  @EventPattern(KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT)
  async listenEventCreateAccountInPTS(
    @Payload() account: AccountPTSEventDto,
    @Ctx() context?: KafkaContext,
  ): Promise<boolean> {
    const originalMessage = context?.getMessage();
    const headers = mapKafkaHeadersToDto(originalMessage?.headers);

    try {
      this.logger.log(
        `listen event - Method: listenEventCreateAccountinPTS - topic: ${
          KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT
        } - BODY: ${JSON.stringify(account)} - Headers: ${JSON.stringify(
          headers,
        )} `,
        headers.transactionId,
      );

      const response = await this.accountService.createAccountInPTS(
        account,
        headers,
      );
      this.logger.log(
        `Finish success Topic: ${KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT}`,
        headers.transactionId,
      );
      await this.accountService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT,
          data: account,
          enrollmentId: account.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${response}`,
              state: EnrollmentStatusEnum.APPROVED,
              actionName: KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT,
            }),
          ],
        },
        headers,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed completion - Topic: ${KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT}`,
        error,
        headers.transactionId,
      );
      clearObject(headers);
      await this.accountService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT,
          data: account,
          enrollmentId: account.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${JSON.stringify(error)}`,
              state: EnrollmentStatusEnum.REJECT,
              actionName: KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT,
            }),
          ],
        },
        headers,
      );
      await this.accountService.kafkaQueueRetry<AccountPTSEventDto>(
        KafkaTopicsConstants.PTS_TOPIC_CREATE_ACCOUNT,
        serviceConfiguration().max_attempts_topic.create_account_pts,
        { value: account, headers },
        JSON.stringify(error),
      );
      return true;
    }
  }
  /**
   * Metodo encargado de escuchar los eventos del topico de kafka: account.create.account
   * Se encarga de insertar en base de datos la información de la cuenta que fue creada previamente en pts-mambu
   * Sexto evento de enrolamiento, el cual fue disparado desde account.create.account.pts
   *
   * @param account - valores que se capturan del evento kafka
   * @param context - Contexto donde se captura los headers
   * @returns - un valor boolean si se proceso correctamente o no el evento
   */
  @EventPattern(KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT)
  async listenEventCreateAccountDB(
    @Payload() account: AccountEventDto,
    @Ctx() context?: KafkaContext,
  ): Promise<boolean> {
    const originalMessage = context?.getMessage();
    const headers = mapKafkaHeadersToDto(originalMessage?.headers);
    try {
      this.logger.log(
        `listen event - Method: listenEventcreateAccountDB - topic: ${
          KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT
        } - BODY: ${JSON.stringify(account)} - Headers: ${JSON.stringify(
          headers,
        )} `,
        headers.transactionId,
      );
      const response = await this.accountService.createAccountDb(
        account,
        headers,
      );
      this.logger.log(
        `Finish success Topic: ${KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT}`,
        headers.transactionId,
      );
      await this.accountService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
          data: account,
          enrollmentId: account.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${response}`,
              state: EnrollmentStatusEnum.APPROVED,
              actionName: KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
            }),
          ],
        },
        headers,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed completion - Topic: ${KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT}`,
        error,
        headers.transactionId,
      );
      clearObject(headers);
      await this.accountService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
          data: account,
          enrollmentId: account.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${JSON.stringify(error)}`,
              state: EnrollmentStatusEnum.REJECT,
              actionName: KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
            }),
          ],
        },
        headers,
      );
      await this.accountService.kafkaQueueRetry<AccountEventDto>(
        KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
        serviceConfiguration().max_attempts_topic.create_account_db,
        { value: account, headers },
        JSON.stringify(error),
      );
      return true;
    }
  }

  /**
   * Metodo encargado de escuchar los eventos del topico de kafka: account.update.account
   * Se encarga de actualizar la Base de datos con los identificadores retornados por crm al registrar el Convenio y el deposito
   * Noveno evento de enrolamiento, el cual fue disparado desde create.contact.agreement.crm
   *
   * @param event - valores que se capturan del evento kafka
   * @param context - Contexto donde se captura los headers
   * @returns - un valor boolean si se proceso correctamente o no el evento
   */
  @EventPattern(KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT)
  async listenEventUpdateAccountEvent(
    @Payload() event: UpdateAccountEventDto,
    @Ctx() context?: KafkaContext,
  ): Promise<boolean> {
    const originalMessage = context?.getMessage();
    const headers = mapKafkaHeadersToDto(originalMessage?.headers);

    try {
      this.logger.log(
        `listen event - Method: listenEventInsertAgreementCrm - topic: ${
          KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT
        } - BODY: ${JSON.stringify(event)} - Headers: ${JSON.stringify(
          headers,
        )} `,
        headers.transactionId,
      );
      const response = await this.accountService.updateAccountEvent(
        event,
        headers,
      );
      this.logger.log(
        `Finish success Topic: ${KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT}`,
        headers.transactionId,
      );
      await this.accountService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
          data: event,
          enrollmentId: event.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${response}`,
              state: EnrollmentStatusEnum.APPROVED,
              actionName: KafkaTopicsConstants.TOPIC_CREATE_ACCOUNT,
            }),
          ],
        },
        headers,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed completion - Topic: ${KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT}`,
        error,
        headers.transactionId,
      );
      clearObject(headers);
      await this.accountService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT,
          data: event,
          enrollmentId: event.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${JSON.stringify(error)}`,
              state: EnrollmentStatusEnum.REJECT,
              actionName: KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT,
            }),
          ],
        },
        headers,
      );
      await this.accountService.kafkaQueueRetry<UpdateAccountEventDto>(
        KafkaTopicsConstants.TOPIC_UPDATE_ACCOUNT,
        serviceConfiguration().max_attempts_topic.update_account_db,
        { value: event, headers },
        JSON.stringify(error),
      );
      return true;
    }
  }
}
