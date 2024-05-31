import { Request, Response } from 'express';
import { IAuthService } from '../service/iAuth.service';
import { IUserService } from '../service/iUser.service';
import { UserService } from '../service/user.service';
import { SuccessResponse } from '../handleError/success.response';

export class AuthController {
  private static Instance: AuthController;
  public static getInstance(): AuthController {
    if (!this.Instance) {
      this.Instance = new AuthController();
    }
    return this.Instance;
  }
}
