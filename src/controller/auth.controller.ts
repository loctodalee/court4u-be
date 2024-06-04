import { Request, Response } from 'express';
import { IAuthService } from '../service/iAuth.service';

import { AuthService } from '../service/auth.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class AuthController {
  private static Instance: AuthController;
  public static getInstance(): AuthController {
    if (!this.Instance) {
      this.Instance = new AuthController();
    }
    return this.Instance;
  }

  /**
   * @description Gửi email khi tạo mới 1 CUSTOMER
   * @param req {username, password, email, phone}
   * @param res {message}
   */
  async sendMailVerify(req: Request, res: Response) {
    var authService: IAuthService = new AuthService();
    new SuccessResponse({
      message: 'Send mail success',
      metaData: await authService.newUser({
        ...req.body,
      }),
    }).send(res);
  }

  /**
   * @description Xác nhận việc verify email thông qua /auth/welcomeback?token="req.quey.token"
   * @param req {req.quey.token}
   * @param res {user: {id, username, phone, avatarUrl, email}, tokens: {accessToken, refreshToken} }
   */
  async checkLoginEmailToken(req: Request, res: Response) {
    var authService: IAuthService = new AuthService();
    new SuccessResponse({
      message: 'Verify success',
      meteData: await authService.checkLoginEmailToken({
        token: req.query.token,
      }),
    }).send(res);
  }

  /**
   * @description Chuyển hướng đến trang login của third party (facebook, google) để xử lý và tạo ra accesstoken và refreshtoken
   * @test localhost:3000/v1/api/auth/google
   * @param req
   * @param res
   */
  async LoginThirdParty(req: Request, res: Response) {
    var authService: IAuthService = new AuthService();
    new SuccessResponse({
      message: 'Login success',
      metaData: await authService.loginWithThirdParty(req.user),
    }).send(res);
  }
}
