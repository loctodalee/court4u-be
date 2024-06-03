import { users } from '@prisma/client';

export interface IAuthService {
  login({ email, password }: { email: string; password: string }): Promise<any>;
  newUser({ email }: { email: string }): Promise<any>;
  checkLoginEmailToken({ token }: { token: any }): Promise<any>;
  LoginWithThirdParty(user: any): Promise<any>;
}
