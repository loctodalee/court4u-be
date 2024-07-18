import { Sex, user, UserStatus } from '@prisma/client';

export interface IUserService {
  getAll(): Promise<any[]>;
  getUserByEmail({ email }: { email: string }): Promise<user | null>;
  getUserById({ id }: { id: string }): Promise<user | null>;
  getUserByIdFilter({ id }: { id: string }): Promise<any>;
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
    otp?: string;
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
  changePasswordAfterSignUp({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }): Promise<void>;
  updateUserOtp(otp: string, userId: string): Promise<user>;
  updateUserInfo({
    id,
    fullname,
    password,
    email,
    sex,
    phone,
    avatarUrl,
    dateOfBirth,
    status,
  }: {
    id: string;
    fullname?: string;
    password?: string;
    email?: string;
    sex?: Sex;
    phone?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    status?: UserStatus;
  }): Promise<user>;
}
