import { user } from '@prisma/client';

export interface IUserRepository {
  getAll(): Promise<user[]>;
  getUser({ options }: { options: any }): Promise<user | null>;
  createNewUser({ options }: { options: any }): Promise<user>;
  updateUser({ options }: { options: any }): Promise<user>;
  upsertUser({ options }: { options: any }): Promise<user>;
}
