import { $Enums, user } from '@prisma/client';
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
  public async getAll(): Promise<user[]> {
    return await prisma.user.findMany();
  }
  public async getUser({ options }: { options: any }): Promise<user | null> {
    return await prisma.user.findFirst(options);
  }

  // create new user
  public async createNewUser({ options }: { options: any }): Promise<user> {
    return await prisma.user.create(options);
  }
  public async updateUser({ options }: { options: any }): Promise<user> {
    return await prisma.user.update(options);
  }
  public async upsertUser({ options }: { options: any }): Promise<user> {
    try {
      return await prisma.user.upsert(options);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
