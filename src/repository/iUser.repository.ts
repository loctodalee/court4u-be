import { User } from '@prisma/client';

export interface IUserRepository {
  getUserById(id: string): Promise<User | null>;
}
