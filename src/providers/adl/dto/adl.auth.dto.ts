export class AdlAuthInput {
  unique_id: string;
}

export class AdlAuthOutput {
  unique_id: string;
  status_code: number;
  cognito_token: {
    access_token: string;
    expires_in: number;
    token_type: string;
  };
}
