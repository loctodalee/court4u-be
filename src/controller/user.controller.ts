import { IUserService } from '../service/interface/iUser.service';
import { UserService } from './../service/user.service';
import { Request, Response } from 'express';
const { SuccessResponse } = require('../handleResponse/success.response');
export class UserController {
  private static readonly userService: IUserService = UserService.getInstance();
  private static Instance: UserController;
  public static getInstance(): UserController {
    if (!this.Instance) {
      this.Instance = new UserController();
    }
    return this.Instance;
  }
  async getAllUser(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get Success',
      metaData: await UserController.userService.getAll(),
    }).send(res);
  }
  async getUserByEmail(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get Success',
      metaData: await UserController.userService.getUserByEmail({
        ...req.body,
      }),
    }).send(res);
  }
  async getUserById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get Success',
      metaData: await UserController.userService.getUserById({
        id: req.params.id,
      }),
    }).send(res);
  }
  async changePasswordAfterRegister(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Change password success',
      metaData: await UserController.userService.changePasswordAfterSignUp({
        userId: req.user.userId,
        password: req.body.password,
      }),
    }).send(res);
  }

  async updateUserInfo(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Update User Success',
      metaData: await UserController.userService.updateUserInfo({
        id: req.user.userId,
        ...req.body,
      }),
    }).send(res);
  }
}
