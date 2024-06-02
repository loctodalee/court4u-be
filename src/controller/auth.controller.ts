import { Request, Response } from 'express';
import { IAuthService } from '../service/iAuth.service';

import { AuthService } from '../service/auth.service';
const { SuccessResponse } = require('../handleError/success.response');

export class AuthController {
  private static Instance: AuthController;
  public static getInstance(): AuthController {
    if (!this.Instance) {
      this.Instance = new AuthController();
    }
    return this.Instance;
  }
  async sendMailVerify(req: Request, res: Response) {
    var authService: IAuthService = new AuthService();
    new SuccessResponse({
      message: 'Send mail success',
      metaData: await authService.newUser({
        ...req.body,
      }),
    }).send(res);
  }
  async checkLoginEmailToken(req: Request, res: Response) {
    var authService: IAuthService = new AuthService();
    new SuccessResponse({
      message: 'Verify success',
      meteData: await authService.checkLoginEmailToken({
        token: req.query.token,
      }),
    });
  }
}
