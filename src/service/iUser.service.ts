import { User } from '@prisma/client';

export interface IUserService {
  getUserById(id: string): Promise<User | undefined>;
}
