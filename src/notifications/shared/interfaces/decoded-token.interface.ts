export interface TokenDecodedInterface {
  email: string;
  name: string;
  iss: string;
  sub: string;
  aud: string[];
  iat: number;
  exp: number;
  azp: string;
  scope: string;
  permissions: string[];
}

export interface TokenValidationResponse {
  authorized: boolean;
  tokenDecoded: TokenDecodedInterface;
}
