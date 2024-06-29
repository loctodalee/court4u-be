import { $Enums, users } from '@prisma/client';
import prisma from '../lib/prisma';
import { IUserRepository } from './interface/iUser.repository';
import { AuthFailure } from '../handleResponse/error.response';

export class UserRepository implements IUserRepository {
  private static Instance: UserRepository;
  public static getInstance(): IUserRepository {
    if (!UserRepository.Instance) {
      UserRepository.Instance = new UserRepository();
    }
    return UserRepository.Instance;
  }
  public async getUser({ options }: { options: any }): Promise<users | null> {
    return await prisma.users.findFirst(options);
  }

  // create new user
  public async createNewUser({ options }: { options: any }): Promise<users> {
    return await prisma.users.create(options);
  }
  public async updateUser({ options }: { options: any }): Promise<users> {
    return await prisma.users.update(options);
  }
  public async upsertUser({ options }: { options: any }): Promise<users> {
    return await prisma.users.upsert(options);
  }
}
