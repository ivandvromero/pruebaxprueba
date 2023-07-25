export interface IClient {
  client: {
    clientId?: string;
    depositNumber?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    identificationNumber?: string;
    identificationType?: string;
    enrollment?: string;
  };
  encodeKey: string;
}
