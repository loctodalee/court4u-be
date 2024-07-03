import { user } from '@prisma/client';

export interface IUserService {
  getAll(): Promise<user[]>;
  getUserByEmail({ email }: { email: string }): Promise<user | null>;
  getUserById({ id }: { id: string }): Promise<user | null>;
  createNewUser({
    fullname,
    password,
    email,
    phone,
    status,
    otp,
  }: {
    fullname: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    otp: string;
  }): Promise<user>;
  updateUser({ options }: { options: any }): Promise<user>;
  updateUserAfterVerify({ otp }: { otp: string }): Promise<user>;
  updateApiKey({
    apiKey,
    userId,
  }: {
    apiKey: string;
    userId: string;
  }): Promise<user>;
  createOrUpdateGoogleUser({
    email,
    googleId,
    googleAccessToken,
    fullname,
    avatarUrl,
  }: {
    email: string;
    googleId: string;
    googleAccessToken: string;
    fullname: string;
    avatarUrl: string;
  }): Promise<user>;

  createOrUpdateFacebookUser({
    email,
    facebookId,
    facebookAccessToken,
    fullname,
    avatarUrl,
  }: {
    email: string;
    facebookId: string;
    facebookAccessToken: string;
    fullname: string;
    avatarUrl: string;
  }): Promise<user>;

  createStaff({
    fullname,
    password,
    email,
    phone,
    status,
    role,
    otp,
    clubId,
  }: {
    fullname: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    role: string[];
    otp: string;
    clubId: string;
  }): Promise<user>;
}
