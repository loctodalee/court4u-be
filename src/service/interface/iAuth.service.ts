import { keyTokens } from '@prisma/client';

export interface IAuthService {
  login({ email, password }: { email: string; password: string }): Promise<any>;
  newUser({
    email,
    fullname,
    password,
    phone,
  }: {
    fullname: string;
    password: string;
    phone: string;
    email: string;
  }): Promise<any>;
  newCourtOwner({
    email,
    fullname,
    password,
    phone,
  }: {
    fullname: string;
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
  logOut(userId: string): Promise<void>;
}
