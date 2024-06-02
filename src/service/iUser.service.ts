import { User, users } from '@prisma/client';

export interface IUserService {
  getUserById(id: string): Promise<users | undefined>;
}
