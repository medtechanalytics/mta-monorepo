
export interface Identity {
  claims: {
    sub: string;
    email_verified: boolean;
    iss: string;
    name: string;
    email: string;
    aud: string;
    iat: number;
    exp: number;
  };
  sourceId: string[];
  groups: null | string | string[];
}
