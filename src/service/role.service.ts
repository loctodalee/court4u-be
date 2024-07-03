import { Role, role, userRole } from '@prisma/client';
import { IRoleRepository } from '../repository/interface/IRole.repository';
import { RoleRepository } from '../repository/role.repository';
import { IRoleService } from './interface/iRole.service';
import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { IUserRoleRepository } from '../repository/interface/IUserRole.repository';
import { UserRoleRepository } from '../repository/userRole.repository';
export class RoleService implements IRoleService {
  private static Instance: RoleService;
  public static getInstance(): RoleService {
    if (!this.Instance) {
      this.Instance = new RoleService();
    }
    return this.Instance;
  }

  private static _roleRepository: IRoleRepository;
  private static _userRoleRepository: IUserRoleRepository;

  static {
    this._roleRepository = RoleRepository.getInstance();
    this._userRoleRepository = UserRoleRepository.getInstance();
  }

  public async addRole({ name }: { name: string }): Promise<role> {
    try {
      return RoleService._roleRepository.addRole(name);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  public async findById(id: string): Promise<role | null> {
    var result = await RoleService._roleRepository.findById(id);
    if (!result) throw new NotFoundError(`Not found role with id: ${id}`);
    return result;
  }

  public async findByName(name: Role): Promise<role | null> {
    var result = await RoleService._roleRepository.findByName(name);
    if (!result) throw new NotFoundError(`Not found role with id: ${name}`);
    return result;
  }

  public async deleteRole(id: string): Promise<void> {
    try {
      await RoleService._roleRepository.deleteRole(id);
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  public async getAllRole(): Promise<role[]> {
    try {
      return await RoleService._roleRepository.getAll();
    } catch (error: any) {
      throw new BadRequestError(error.message);
    }
  }

  public async assignRoleToUser({
    userId,
    roleId,
  }: {
    userId: string;
    roleId: string;
  }): Promise<userRole> {
    try {
      return await RoleService._userRoleRepository.addUserRole({
        userId,
        roleId,
      });
    } catch (error: any) {
      throw new BadRequestError(error);
    }
  }

  public async getAllUserRole(): Promise<userRole[]> {
    return RoleService._userRoleRepository.findUserRole();
  }

  public async findUserRole(data: {
    userId?: string;
    roleId?: string;
  }): Promise<userRole[] | null> {
    var result = await RoleService._userRoleRepository.findUserRole(data);
    if (!result) throw new NotFoundError('Not found user role');
    return result;
  }
}
