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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const authUtils_1 = require("../auth/authUtils");
const error_response_1 = require("../handleResponse/error.response");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const keyToken_service_1 = require("./keyToken.service");
const filterData_1 = require("../util/filterData");
const email_service_1 = require("./email.service");
const user_service_1 = require("./user.service");
const role_service_1 = require("./role.service");
class AuthService {
    constructor() {
        //create public key and private key
        this.createKeys = () => {
            const publicKey = crypto_1.default.randomBytes(64).toString('hex');
            const privateKey = crypto_1.default.randomBytes(64).toString('hex');
            return { publicKey, privateKey };
        };
    }
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    //login
    login(_b) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, }) {
            const foundUser = yield _a._userService.getUserByEmail({ email });
            if (!foundUser) {
                throw new error_response_1.BadRequestError('Login fail');
            }
            if (foundUser.password == null)
                throw new error_response_1.BadRequestError('Login fail');
            if (foundUser.status == 'disable')
                throw new error_response_1.BadRequestError('Login fail');
            const match = yield bcrypt_1.default.compare(password, foundUser.password);
            if (!match) {
                throw new error_response_1.BadRequestError('Login fail');
            }
            //get roles
            const foundRole = yield _a._roleService.findUserRole({
                userId: foundUser.id,
            });
            if (!foundRole)
                throw new error_response_1.BadRequestError('Login fail');
            const listRole = yield _a._roleService.findRoleName(foundRole);
            const listName = listRole.map((x) => x.name);
            //create public key for accessToken, private key for refreshToken
            const keys = this.createKeys();
            //create accessToken and RefreshToken
            const tokens = yield (0, authUtils_1.createTokenPair)({
                payload: {
                    userId: foundUser.id,
                    email: foundUser.email,
                    roles: listName,
                },
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
            });
            yield _a._keyTokenService.upsertKey({
                userId: foundUser.id,
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
                refreshToken: tokens.refreshToken,
            });
            const apiKey = foundUser.apiKey;
            return {
                tokens,
                apiKey,
            };
        });
    }
    //end login
    // -------- new court owner
    newCourtOwner(_b) {
        return __awaiter(this, arguments, void 0, function* ({ fullname, password, phone, email, }) {
            const foundUser = yield _a._userService.getUserByEmail({ email });
            if (foundUser) {
                throw new error_response_1.NotImplementError('Email already existed');
            }
            // send mail
            const result = yield _a._emailService.sendEmailToken({ email });
            console.log(result);
            // create user with status = false
            const hashPassword = yield bcrypt_1.default.hash(password, 10);
            var user = yield _a._userService.createNewUser({
                email,
                password: hashPassword,
                otp: result.toString(),
                phone,
                status: 'disable',
                fullname,
                // role: ['owner'],
            });
            const roleMember = yield _a._roleService.findByName('owner');
            if (!roleMember)
                throw new error_response_1.BadRequestError('Not found role');
            yield _a._roleService.assignRoleToUser({
                roleId: roleMember.id,
                userId: user.id,
            });
            return {
                message: 'Verify email court owner',
            };
        });
    }
    // ---------new customer
    newUser(_b) {
        return __awaiter(this, arguments, void 0, function* ({ fullname, password, phone, email, }) {
            const foundUser = yield _a._userService.getUserByEmail({ email });
            if (foundUser) {
                throw new error_response_1.NotImplementError('Email already existed');
            }
            // send mail
            const result = yield _a._emailService.sendEmailToken({ email });
            console.log(result);
            // create user with status = false
            const hashPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield _a._userService.createNewUser({
                email,
                password: hashPassword,
                otp: result.toString(),
                phone,
                status: 'disable',
                fullname,
            });
            const roleMember = yield _a._roleService.findByName('member');
            if (!roleMember)
                throw new error_response_1.BadRequestError('Not found role');
            yield _a._roleService.assignRoleToUser({
                roleId: roleMember.id,
                userId: user.id,
            });
            return {
                message: 'Verify email user',
            };
        });
    }
    //---------- check email token
    checkLoginEmailToken(_b) {
        return __awaiter(this, arguments, void 0, function* ({ token }) {
            // search and update status, set otp user to null
            const foundUser = yield _a._userService.updateUserAfterVerify({
                otp: token,
            });
            if (!foundUser)
                throw new error_response_1.NotFoundError('Token not found');
            const keys = this.createKeys();
            const foundRole = yield _a._roleService.findUserRole({
                userId: foundUser.id,
            });
            if (!foundRole)
                throw new error_response_1.BadRequestError('Login fail');
            const listRole = yield _a._roleService.findRoleName(foundRole);
            const listName = listRole.map((x) => x.name);
            const tokens = yield (0, authUtils_1.createTokenPair)({
                payload: {
                    userId: foundUser.id,
                    email: foundUser.email,
                    roles: listName,
                },
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
            });
            yield _a._keyTokenService.upsertKey({
                userId: foundUser.id,
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
                refreshToken: tokens.refreshToken,
            });
            return {
                user: (0, filterData_1.filterData)({
                    fields: ['id', 'fullname', 'phone', 'avatarUrl', 'email', 'apiKey'],
                    object: foundUser,
                }),
                tokens: tokens,
            };
        });
    }
    //--------login with third party
    loginWithThirdParty(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = this.createKeys();
            const foundRole = yield _a._roleService.findUserRole({
                userId: user.id,
            });
            if (!foundRole)
                throw new error_response_1.BadRequestError('Login fail');
            const listRole = yield _a._roleService.findRoleName(foundRole);
            const listName = listRole.map((x) => x.name);
            const tokens = yield (0, authUtils_1.createTokenPair)({
                payload: {
                    userId: user.id,
                    email: user.email,
                    roles: listName,
                },
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
            });
            yield _a._keyTokenService.upsertKey({
                userId: user.id,
                publicKey: keys.publicKey,
                privateKey: keys.privateKey,
                refreshToken: tokens.refreshToken,
            });
            // console.log(tokens);
            return tokens;
        });
    }
    handleRefreshToken(_b) {
        return __awaiter(this, arguments, void 0, function* ({ keyStore, user, refreshToken, }) {
            const { userId, email } = user;
            const foundRole = yield _a._roleService.findUserRole({
                userId: user.id,
            });
            if (!foundRole)
                throw new error_response_1.BadRequestError('Login fail');
            const listRole = yield _a._roleService.findRoleName(foundRole);
            const listName = listRole.map((x) => x.name);
            if (keyStore.refreshTokenUsed.includes(refreshToken)) {
                _a._keyTokenService.deleteKeyByUserId({ userId });
                throw new error_response_1.ForbiddenError('Something go wrong');
            }
            if (keyStore.refreshToken !== refreshToken)
                throw new error_response_1.AuthFailure('Refresh token is wrong');
            const tokens = yield (0, authUtils_1.createTokenPair)({
                payload: {
                    userId: user.id,
                    email: user.email,
                    roles: listName,
                },
                publicKey: keyStore.publicKey,
                privateKey: keyStore.privateKey,
            });
            const keyToken = yield _a._keyTokenService.foundKey({
                userId,
            });
            if (!keyToken)
                throw new error_response_1.AuthFailure('Key token not found');
            const result = yield _a._keyTokenService.updateKeyToken({
                currentToken: keyToken,
                refreshToken: tokens.refreshToken,
                userId,
            });
            return tokens;
            return foundRole;
        });
    }
}
exports.AuthService = AuthService;
_a = AuthService;
(() => {
    _a._keyTokenService = keyToken_service_1.KeyTokenService.getInstance();
    _a._userService = user_service_1.UserService.getInstance();
    _a._emailService = email_service_1.EmailService.getInstance();
    _a._roleService = role_service_1.RoleService.getInstance();
})();
