import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function Headers() {
  return applyDecorators(
    ApiHeader({
      required: true,
      name: 'TransactionId',
    }),
    ApiHeader({
      required: true,
      name: 'ChannelId',
    }),
    ApiHeader({
      required: true,
      name: 'SessionId',
    }),
    ApiHeader({
      required: true,
      name: 'Timestamp',
    }),
    ApiHeader({
      required: true,
      name: 'IpAddress',
    }),
    ApiHeader({
      required: true,
      name: 'Application',
    }),
  );
}
