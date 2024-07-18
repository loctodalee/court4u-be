import { Sex, user, UserStatus } from '@prisma/client';

export interface IUserRepository {
  getAll(): Promise<any[]>;
  getUser({ options }: { options: any }): Promise<user | null>;
  createNewUser({ options }: { options: any }): Promise<user>;
  updateUser({ options }: { options: any }): Promise<user>;
  upsertUser({ options }: { options: any }): Promise<user>;
  updateUserOtp(otp: string, userId: string): Promise<user>;
  updatePassword(userId: string, password: string): Promise<user>;
  updateUserInfo(
    id: string,
    data: {
      fullname?: string;
      password?: string;
      email?: string;
      sex?: Sex;
      phone?: string;
      avatarUrl?: string;
      dateOfBirth?: string;
      status?: UserStatus;
    }
  ): Promise<user>;
}
