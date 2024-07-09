"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../service/auth.service");
const passport_1 = __importDefault(require("passport"));
const { SuccessResponse } = require('../handleResponse/success.response');
class AuthController {
    static getInstance() {
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
    Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield AuthController.authService.login(Object.assign({}, req.body));
            new SuccessResponse({
                message: 'Login success',
                metaData: data,
            }).send(res, data.tokens.accessToken, data.tokens.refreshToken);
        });
    }
    /**
     * @description Gửi email khi tạo mới 1 CUSTOMER
     * @param req {username, password, email, phone}
     * @param res {message}
     */
    sendMailVerify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Send mail success',
                metaData: yield AuthController.authService.newUser(Object.assign({}, req.body)),
            }).send(res);
        });
    }
    /**
     * @description Xác nhận việc verify email thông qua /auth/welcomeback?token="req.quey.token"
     * @param req {req.quey.token}
     * @param res {user: {id, username, phone, avatarUrl, email}, tokens: {accessToken, refreshToken} }
     */
    checkLoginEmailToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AuthController.authService.checkLoginEmailToken({
                token: req.query.token,
            }),
                res.redirect('http://localhost:3000/login');
        });
    }
    /**
     * @description Chuyển hướng đến trang login của third party (facebook, google) để xử lý và tạo ra accesstoken và refreshtoken
     * @test localhost:3000/v1/api/auth/google
     * @param req
     * @param res
     */
    LoginThirdParty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield AuthController.authService.loginWithThirdParty(req.user);
            console.log(tokens);
            res.redirect(`http://localhost:3000/redirect?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
        });
    }
    LoginGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            passport_1.default.authenticate('google', { scope: ['profile', 'email'] })(req, res);
        });
    }
    /**
     * @description tự động get access token lại khi hết hạn
     * @param req  gắn thêm refreshtoken và client-id vào header của request
     * @param res {user info, tokens}
     */
    handleRefreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Login with refreshToken',
                metaData: yield AuthController.authService.handleRefreshToken({
                    keyStore: req.keyStores,
                    refreshToken: req.refreshToken,
                    user: req.user,
                }),
            }).send(res);
        });
    }
    /**
     * @description đăng ký tài khoản cho court owner
     * @param req {username, password, email, phone}
     * @param res {message}
     */
    signUpCourtOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Send mail success',
                metaData: yield AuthController.authService.newCourtOwner(Object.assign({}, req.body)),
            }).send(res);
        });
    }
}
exports.AuthController = AuthController;
AuthController.authService = auth_service_1.AuthService.getInstance();
