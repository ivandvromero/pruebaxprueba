import { Expose, Transform, TransformFnParams } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class HeaderDTO {
  @IsUUID()
  @Expose({ name: 'transactionid' })
  TransactionId: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'channelid' })
  ChannelId: string;

  @IsDefined()
  @Expose({ name: 'sessionid' })
  SessionId?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'timestamp' })
  Timestamp: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'ipaddress' })
  IpAddress: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'application' })
  Application: string;
}

export class HeaderSqsDto {
  @IsUUID()
  @Expose({ name: 'transactionid' })
  transactionId: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Expose({ name: 'channelid' })
  channelId: string;

  @IsUUID()
  @IsDefined()
  @Expose({ name: 'sessionid' })
  @IsOptional()
  sessionId?: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  // @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'timestamp' })
  timestamp: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'ipaddress' })
  ipAddress: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Expose({ name: 'application' })
  application: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Expose({ name: 'user-agent' })
  'user-agent': string;
}
