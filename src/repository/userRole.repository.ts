import { userRole } from '@prisma/client';
import { IUserRoleRepository } from './interface/IUserRole.repository';
import prisma from '../lib/prisma';

export class UserRoleRepository implements IUserRoleRepository {
  private static Instance: UserRoleRepository;
  public static getInstance(): UserRoleRepository {
    if (!this.Instance) {
      this.Instance = new UserRoleRepository();
    }
    return this.Instance;
  }

  public async addUserRole({
    userId,
    roleId,
  }: {
    userId: string;
    roleId: string;
  }): Promise<userRole> {
    try {
      return await prisma.userRole.create({
        data: {
          userId,
          roleId,
        },
      });
    } catch (e: any) {
      throw Error(e.message);
    }
  }

  public async findUserRole(data?: {
    userId?: string;
    roleId?: string;
  }): Promise<userRole[]> {
    return await prisma.userRole.findMany({
      where: {
        ...data,
      },
    });
  }

  public async deleteUserRole(id: string): Promise<void> {
    try {
      await prisma.userRole.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
