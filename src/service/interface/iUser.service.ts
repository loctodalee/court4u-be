import { users } from '@prisma/client';

export interface IUserService {
  getUserByEmail({ email }: { email: string }): Promise<users | null>;
  getUserById({ id }: { id: string }): Promise<users | null>;
  createNewUser({
    fullname,
    password,
    email,
    phone,
    status,
    role,
    otp,
  }: {
    fullname: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    role: string[];
    otp: string;
  }): Promise<users>;
  updateUser({ options }: { options: any }): Promise<users>;
  updateUserAfterVerify({ otp }: { otp: string }): Promise<users>;
  updateApiKey({
    apiKey,
    userId,
  }: {
    apiKey: string;
    userId: string;
  }): Promise<users>;
  createOrUpdateGoogleUser({
    email,
    googleId,
    googleAccessToken,
    username,
    avatarUrl,
  }: {
    email: string;
    googleId: string;
    googleAccessToken: string;
    username: string;
    avatarUrl: string;
  }): Promise<users>;

  createOrUpdateFacebookUser({
    email,
    facebookId,
    facebookAccessToken,
    username,
    avatarUrl,
  }: {
    email: string;
    facebookId: string;
    facebookAccessToken: string;
    username: string;
    avatarUrl: string;
  }): Promise<users>;

  createStaff({
    username,
    password,
    email,
    phone,
    status,
    role,
    otp,
    clubId,
  }: {
    username: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    role: string[];
    otp: string;
    clubId: string;
  }): Promise<users>;
}
