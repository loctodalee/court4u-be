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

  async getUserById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Get Success',
      metaData: await UserController.userService.getUserByEmail({
        ...req.body,
      }),
    }).send(res);
  }
}
