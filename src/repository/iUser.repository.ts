import { users } from '@prisma/client';

export interface IUserRepository {
  getUser({ options }: { options: any }): Promise<users | null>;
  createNewUser({ options }: { options: any }): Promise<users>;
  updateUser({ options }: { options: any }): Promise<users>;
  upsertUser({ options }: { options: any }): Promise<users>;
}
