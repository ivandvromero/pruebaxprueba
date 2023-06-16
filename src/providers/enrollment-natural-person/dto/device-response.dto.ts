import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DetailtEnrollmentDeviceResponse {
  @IsString()
  deviceId: string;

  @IsString()
  deviceName: string;

  @IsString()
  deviceVersion: string;

  @IsString()
  deviceAppInfo: string;

  @IsString()
  deviceOperativeSystem: string;
}

export class DetailtDeviceResponse {
  @ValidateNested({ each: true })
  @Type(() => DetailtEnrollmentDeviceResponse)
  @IsDefined()
  @IsNotEmptyObject()
  device: DetailtEnrollmentDeviceResponse;
}

export class ErrorData {
  @IsString()
  code?: string;

  @IsString()
  description?: string;
}

export class DetailtDeviceDataResponse {
  @ValidateNested({ each: true })
  @Type(() => DetailtDeviceResponse)
  @IsOptional()
  data?: DetailtDeviceResponse;

  @ValidateNested({ each: true })
  @ValidateNested({ each: true })
  @Type(() => ErrorData)
  @IsOptional()
  error?: ErrorData;
}

export class DeviceDataResponse {
  Field_K7_0110: string;
  Field_K7_0111: string;
  Field_K7_0112: string;
  Field_K7_0113: string;
  Field_K7_0118: string;
  Field_K7_0119: string;
  Field_K7_0132: number;
}
