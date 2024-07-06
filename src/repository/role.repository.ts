import { Role, role, userRole } from '@prisma/client';
import { IRoleRepository } from './interface/IRole.repository';
import prisma from '../lib/prisma';
import { BadRequestError } from '../handleResponse/error.response';
export class RoleRepository implements IRoleRepository {
  private static Instance: RoleRepository;
  public static getInstance(): RoleRepository {
    if (!this.Instance) {
      this.Instance = new RoleRepository();
    }
    return this.Instance;
  }

  public async addRole(name: Role): Promise<role> {
    try {
      return await prisma.role.create({
        data: {
          name,
        },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public async getAll(): Promise<role[]> {
    return await prisma.role.findMany();
  }

  public async findById(id: string): Promise<role | null> {
    return await prisma.role.findFirst({
      where: {
        id,
      },
    });
  }

  public async findByName(name: Role): Promise<role | null> {
    return await prisma.role.findFirst({
      where: {
        name,
      },
    });
  }

  public async deleteRole(id: string): Promise<void> {
    try {
      await prisma.role.delete({
        where: {
          id,
        },
      });
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async getListRoleById(listUserRole: userRole[]): Promise<role[]> {
    const roleIds = listUserRole.map((userRole) => userRole.roleId);
    return await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });
  }
}
