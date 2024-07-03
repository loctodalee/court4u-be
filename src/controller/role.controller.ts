import { Request, Response } from 'express';
import { IRoleService } from '../service/interface/iRole.service';
import { RoleService } from '../service/role.service';
import { Role } from '@prisma/client';
const { SuccessResponse } = require('../handleResponse/success.response');

export class RoleController {
  private static Instance: RoleController;
  public static getInstance(): RoleController {
    if (!this.Instance) {
      this.Instance = new RoleController();
    }
    return this.Instance;
  }

  private static _roleSerivce: IRoleService = RoleService.getInstance();
  async addRole(req: Request, res: Response) {
    new SuccessResponse({
      message: 'create new role success',
      metaData: await RoleController._roleSerivce.addRole({
        ...req.body,
      }),
    }).send(res);
  }

  async findRoleById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get role success',
      metaData: await RoleController._roleSerivce.findById(req.params.id),
    }).send(res);
  }

  async findByName(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get role success',
      metaData: await RoleController._roleSerivce.findByName(
        req.params.name as Role
      ),
    });
  }

  async deleteRole(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Remove role success',
      metaData: await RoleController._roleSerivce.deleteRole(req.params.id),
    }).send(res);
  }

  async getAllRole(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Remove role success',
      metaData: await RoleController._roleSerivce.getAllRole(),
    }).send(res);
  }
  async assignRoleToUser(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Assign role to user success',
      metaData: await RoleController._roleSerivce.assignRoleToUser({
        ...req.body,
      }),
    }).send(res);
  }

  async getAllUserRole(req: Request, res: Response) {
    new SuccessResponse({
      message: 'find role to user success',
      metaData: await RoleController._roleSerivce.getAllUserRole(),
    }).send(res);
  }

  async findUserRole(req: Request, res: Response) {
    const data = { userId: req.params.userId, roleId: req.params.roleId };
    new SuccessResponse({
      message: 'find role to user success',
      metaData: await RoleController._roleSerivce.findUserRole(data),
    }).send(res);
  }
}
