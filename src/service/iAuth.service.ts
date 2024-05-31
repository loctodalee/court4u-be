export interface IAuthService {
  login({ email, password }: { email: string; password: string }): Promise<any>;
}
