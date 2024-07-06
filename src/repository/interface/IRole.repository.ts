import { Role, role, userRole } from '@prisma/client';

export interface IRoleRepository {
  getAll(): Promise<role[]>;
  findById(id: string): Promise<role | null>;
  findByName(name: Role): Promise<role | null>;
  addRole(name: string): Promise<role>;
  deleteRole(id: string): Promise<void>;
  getListRoleById(listUserRole: userRole[]): Promise<role[]>;
}
