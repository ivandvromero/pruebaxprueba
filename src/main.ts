// call initially to setup app env vars
import './config/env/env.config';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@dale/logger-nestjs';
import * as AWSXRay from 'aws-xray-sdk';
import * as http from 'http';
import { registerSwagger } from '@dale/shared-nestjs/utils/swagger';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { AuditInterceptor } from '@dale/shared-nestjs/utils/audit/audit-interceptor';

import serviceConfiguration from './config/service-configuration';
import { MonitorServiceModule } from './monitor-service.module';
import { KAFKA_CLIENT_PTS_CONFIG, KAFKA_CLIENT_CONFIG } from './config/kafka';

const logger = new Logger({ context: 'Monitor Service ' });
const isAWS =
  serviceConfiguration().service.cloud_service_provider.toUpperCase() === 'AWS';

async function bootstrap() {
  const configFactory = {};

  if (isAWS) {
    AWSXRay.setDaemonAddress(serviceConfiguration().aws.xray_daemon_address);
    AWSXRay.config([AWSXRay.plugins.EC2Plugin, AWSXRay.plugins.ECSPlugin]);
    AWSXRay.captureHTTPsGlobal(http);
    AWSXRay.setContextMissingStrategy('LOG_ERROR');
    Object.assign(configFactory, {
      httpsOptions: {
        key: serviceConfiguration().aws.private_key.replace(/\\n/gm, '\n'),
        cert: serviceConfiguration().aws.public_key.replace(/\\n/gm, '\n'),
      },
    });
  }

  const app = await NestFactory.create(MonitorServiceModule, configFactory);

  if (isAWS) {
    app.use(AWSXRay.express.openSegment(serviceConfiguration().service.name));
  }

  if (serviceConfiguration().service.auditable === 'true') {
    app.useGlobalInterceptors(
      new AuditInterceptor(serviceConfiguration().service.name),
    );
  }
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.connectMicroservice(KAFKA_CLIENT_CONFIG);
  app.connectMicroservice(KAFKA_CLIENT_PTS_CONFIG);
  registerSwagger(app, serviceConfiguration().service.name);
  await app.startAllMicroservices();

  if (isAWS) {
    app.use(AWSXRay.express.closeSegment());
  }
  await app.listen(serviceConfiguration().service.port || 3000);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap();
