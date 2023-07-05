export class UserInfoEnrollmentResponse {
  documentNumber: string;
  documentType: string;
  email: string;
  expeditionDate: string;
  firstName: string;
  firstSurname: string;
  gender: number;
  phonePrefix: string;
  phoneNumber: string;
  validationData: {
    request: {
      requestedAt: string;
      responseCode: string;
      securityCode: string;
    };
    userData: {
      firstSurname: string;
      fullName: string;
      name: string;
      secondSurname: string;
      rut: string;
      validated: string;
      metadata: {
        age: any;
        demographicInfo: any;
      };
      documentData: {
        city: string;
        department: string;
        documentNumber: string;
        expeditionDate: string;
        status: string;
      };
    };
  };
}
