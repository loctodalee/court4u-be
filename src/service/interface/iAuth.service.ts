import { users, keyTokens } from '@prisma/client';

export interface IAuthService {
  login({ email, password }: { email: string; password: string }): Promise<any>;
  newUser({
    email,
    username,
    password,
    phone,
  }: {
    username: string;
    password: string;
    phone: string;
    email: string;
  }): Promise<any>;
  newCourtOwner({
    email,
    username,
    password,
    phone,
  }: {
    username: string;
    password: string;
    phone: string;
    email: string;
  }): Promise<any>;
  checkLoginEmailToken({ token }: { token: any }): Promise<any>;
  loginWithThirdParty(user: any): Promise<any>;
  handleRefreshToken({
    keyStore,
    user,
    refreshToken,
  }: {
    keyStore: keyTokens;
    user: any;
    refreshToken: string;
  }): Promise<any>;
}
