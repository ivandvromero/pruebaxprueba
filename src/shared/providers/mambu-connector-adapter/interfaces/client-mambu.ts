export interface ClientMambu {
  encodedKey: string;
  id: string;
  state: string;
  creationDate: Date;
  lastModifiedDate: Date;
  activationDate: Date;
  approvedDate: Date;
  firstName: string;
  lastName: string;
  mobilePhone: string;
  emailAddress: string;
  preferredLanguage: string;
  notes: string;
  clientRoleKey: string;
  loanCycle: number;
  groupLoanCycle: number;
  groupKeys: [];
  addresses: [];
  idDocuments: [];
  _identificationDocument: {
    identificationNumber: string;
    identificationType: string;
  };
  _clientDetails: {
    clientType: string;
  };
}
