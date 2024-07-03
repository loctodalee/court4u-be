import { userRole } from '@prisma/client';

export interface IUserRoleRepository {
  addUserRole({
    userId,
    roleId,
  }: {
    userId: string;
    roleId: string;
  }): Promise<userRole>;

  findUserRole(data?: {
    userId?: string;
    roleId?: string;
  }): Promise<userRole[]>;
  deleteUserRole(id: string): Promise<void>;
}
