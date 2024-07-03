import { Role, role, userRole } from '@prisma/client';

export interface IRoleService {
  addRole({ name }: { name: string }): Promise<role>;
  findById(id: string): Promise<role | null>;
  findByName(name: Role): Promise<role | null>;
  deleteRole(id: string): Promise<void>;
  getAllRole(): Promise<role[]>;
  assignRoleToUser({
    userId,
    roleId,
  }: {
    userId: string;
    roleId: string;
  }): Promise<userRole>;
  getAllUserRole(): Promise<userRole[]>;
  findUserRole(data: {
    userId?: string;
    roleId?: string;
  }): Promise<userRole[] | null>;
}
