import { Request, Response } from 'express';
import { IAuthService } from '../service/interface/iAuth.service';

import { AuthService } from '../service/auth.service';
import passport from 'passport';
const { SuccessResponse } = require('../handleResponse/success.response');

export class AuthController {
  private static readonly authService: IAuthService = AuthService.getInstance();
  private static Instance: AuthController;
  public static getInstance(): AuthController {
    if (!this.Instance) {
      this.Instance = new AuthController();
    }
    return this.Instance;
  }
  /**
   * @description Login
   * @param req : {email, password}
   * @param res : {user info, tokens}
   */
  async Login(req: Request, res: Response) {
    const data = await AuthController.authService.login({ ...req.body });
    new SuccessResponse({
      message: 'Login success',
      metaData: data,
    }).send(res, data.tokens.accessToken, data.tokens.refreshToken);
  }

  /**
   * @description Gửi email khi tạo mới 1 CUSTOMER
   * @param req {username, password, email, phone}
   * @param res {message}
   */
  async sendMailVerify(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Send mail success',
      metaData: await AuthController.authService.newUser({
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
    await AuthController.authService.checkLoginEmailToken({
      token: req.query.token,
    }),
      res.redirect('http://localhost:3000/login');
  }

  /**
   * @description Chuyển hướng đến trang login của third party (facebook, google) để xử lý và tạo ra accesstoken và refreshtoken
   * @test localhost:3000/v1/api/auth/google
   * @param req
   * @param res
   */
  async LoginThirdParty(req: Request, res: Response) {
    const tokens = await AuthController.authService.loginWithThirdParty(
      req.user
    );
    console.log(tokens);
    res.redirect(
      `http://localhost:3000/redirect?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`
    );
  }
  async LoginGoogle(req: Request, res: Response) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }
  /**
   * @description tự động get access token lại khi hết hạn
   * @param req  gắn thêm refreshtoken và client-id vào header của request
   * @param res {user info, tokens}
   */
  async handleRefreshToken(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Login with refreshToken',
      metaData: await AuthController.authService.handleRefreshToken({
        keyStore: req.keyStores,
        refreshToken: req.refreshToken,
        user: req.user,
      }),
    }).send(res);
  }
  /**
   * @description đăng ký tài khoản cho court owner
   * @param req {username, password, email, phone}
   * @param res {message}
   */
  async signUpCourtOwner(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Send mail success',
      metaData: await AuthController.authService.newCourtOwner({ ...req.body }),
    }).send(res);
  }
}
