import { IUserService } from '../service/iUser.service';
import { UserService } from './../service/user.service';
import { Request, Response } from 'express';
export class UserController {
  private static Instance: UserController;
  public static getInstance(): UserController {
    if (!this.Instance) {
      this.Instance = new UserController();
    }
    return this.Instance;
  }
  async getUserById(req: Request, res: Response) {
    var userService: IUserService = new UserService();
    return res.status(200).json({
      message: 'get success',
      data: await userService.getUserById('awdad'),
    });
  }
}
