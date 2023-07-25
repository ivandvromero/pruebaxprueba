import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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

  @IsUUID()
  @IsDefined()
  @Expose({ name: 'sessionid' })
  SessionId: string;

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

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Expose({ name: 'apiversion' })
  ApiVersion: number;
}
