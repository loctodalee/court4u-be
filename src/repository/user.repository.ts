import prisma from '../lib/prisma';
import { User } from '@prisma/client';
import { IUserRepository } from './iUser.repository';

export class UserRepository implements IUserRepository {
  private static Instance: UserRepository;
  public static getInstance(): UserRepository {
    if (!UserRepository.Instance) {
      UserRepository.Instance = new UserRepository();
    }
    return UserRepository.Instance;
  }

  public async getUserById(id: string): Promise<User | null> {
    return prisma.user.findFirst();
  }
}
