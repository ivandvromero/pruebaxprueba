export class UserDto {
  person: {
    documentType?: string;
    documentNumber?: string;
    expeditionDate?: string;
    phoneNumber?: string;
    phonePrefix?: string;
    firstName?: string;
    firstSurname?: string;
    gender?: number | string;
    email?: string;
    externalId?: number;
    externalNumber?: string;
    country?: string;
  };

  deviceInfo: {
    deviceId: string;
    deviceName?: string;
    ipAddress?: string;
    userAgent?: string;
    attempt?: number;
  };
}
