import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { KafkaTopicsConstants } from './constants/api';
import { UserEventDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Logger } from '@dale/logger-nestjs';
import {
  clearObject,
  mapKafkaHeadersToDto,
} from 'src/shared/utils/map-kafka-headers-to-dto';
import serviceConfiguration from 'src/config/service-configuration';
import { EnrollmentStepActions } from 'src/shared/dto/events.dto';
import { EnrollmentStatusEnum } from 'src/constants/common';

@Controller('user-events')
export class UserEventsController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  /**
   * Metodo encargado de escuchar los eventos del topico de kafka: user.update.user
   * Se encarga de actualizar la base de datos user que se encuentra en postgres, con los identificadores retornados por CRM y PTS
   * Cuarto evento de enrollment, el cual es disparado por customer.create.customer.pts
   *
   * @param user - valores que se capturan del evento kafka
   * @param context - Contexto donde se captura los headers
   * @returns - un valor boolean si se proceso correctamente o no el evento
   */
  @EventPattern(KafkaTopicsConstants.TOPIC_UPDATE_USER)
  async listenEventUpdateUserDb(
    @Payload() user: UserEventDto,
    @Ctx() context?: KafkaContext,
  ): Promise<boolean> {
    const originalMessage = context?.getMessage();
    const headers = mapKafkaHeadersToDto(originalMessage?.headers);

    try {
      this.logger.log(
        `listen event - Method: listenEventUpdateUserDb - topic: ${
          KafkaTopicsConstants.TOPIC_UPDATE_USER
        } - BODY: ${JSON.stringify(user)} - Headers: ${JSON.stringify(
          headers,
        )} `,
        headers.transactionId,
      );
      const result = await this.userService.updateUserEvent(user, headers);
      this.logger.log(
        `Finish success Topic: ${KafkaTopicsConstants.TOPIC_UPDATE_USER}`,
        headers.transactionId,
      );
      await this.userService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.TOPIC_UPDATE_USER,
          data: user,
          enrollmentId: user.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${result}`,
              state: EnrollmentStatusEnum.APPROVED,
              actionName: KafkaTopicsConstants.TOPIC_UPDATE_USER,
            }),
          ],
        },
        headers,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed completion - Topic: ${KafkaTopicsConstants.TOPIC_UPDATE_USER}`,
        error,
        headers.transactionId,
      );
      clearObject(headers);
      await this.userService.insertEnrollmentQueueStepData(
        {
          step: KafkaTopicsConstants.TOPIC_UPDATE_USER,
          data: user,
          enrollmentId: user.enrollmentId,
          actions: [
            new EnrollmentStepActions({
              order: 1,
              response: `${JSON.stringify(error)}`,
              state: EnrollmentStatusEnum.REJECT,
              actionName: KafkaTopicsConstants.TOPIC_UPDATE_USER,
            }),
          ],
        },
        headers,
      );
      await this.userService.kafkaQueueRetry<UserEventDto>(
        KafkaTopicsConstants.TOPIC_UPDATE_USER,
        serviceConfiguration().max_attempts_topic.update_user_db,
        { value: user, headers },
        JSON.stringify(error),
      );
      return true;
    }
  }
}
