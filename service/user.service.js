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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("../repository/user.repository");
const error_response_1 = require("../handleResponse/error.response");
class UserService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new UserService();
        }
        return this.Instance;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return user_repository_1.UserRepository.getInstance().getAll();
        });
    }
    getUserByEmail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, }) {
            const options = {
                where: {
                    email,
                },
            };
            return yield user_repository_1.UserRepository.getInstance().getUser({ options });
        });
    }
    getUserById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const options = {
                where: {
                    id,
                },
            };
            return yield user_repository_1.UserRepository.getInstance().getUser({ options });
        });
    }
    createNewUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fullname, password, email, phone, status, otp, }) {
            const options = {
                data: {
                    fullname,
                    password,
                    email,
                    phone,
                    status,
                    otp,
                },
            };
            return yield user_repository_1.UserRepository.getInstance().createNewUser({ options });
        });
    }
    updateUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options }) {
            return yield user_repository_1.UserRepository.getInstance().updateUser({ options });
        });
    }
    updateApiKey(_a) {
        return __awaiter(this, arguments, void 0, function* ({ apiKey, userId, }) {
            const options = {
                where: {
                    id: userId,
                },
                data: {
                    apiKey,
                },
            };
            return yield user_repository_1.UserRepository.getInstance().updateUser({ options });
        });
    }
    updateUserAfterVerify(_a) {
        return __awaiter(this, arguments, void 0, function* ({ otp }) {
            const options = {
                where: {
                    otp,
                },
                data: {
                    status: 'active',
                    otp: null,
                },
            };
            return yield user_repository_1.UserRepository.getInstance().updateUser({ options });
        });
    }
    createOrUpdateGoogleUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, googleId, googleAccessToken, fullname, avatarUrl, }) {
            const options = {
                where: {
                    googleId,
                },
                update: {
                    googleAccessToken,
                },
                create: {
                    googleId,
                    googleAccessToken,
                    email,
                    fullname,
                    avatarUrl,
                    status: 'active',
                },
            };
            try {
                const user = yield user_repository_1.UserRepository.getInstance().upsertUser({ options });
                return user;
            }
            catch (e) {
                throw new error_response_1.BadRequestError();
            }
        });
    }
    createOrUpdateFacebookUser(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, facebookId, facebookAccessToken, fullname, avatarUrl, }) {
            const options = {
                where: {
                    facebookId,
                },
                update: {
                    facebookAccessToken,
                },
                create: {
                    facebookId,
                    facebookAccessToken,
                    email,
                    fullname,
                    avatarUrl,
                    status: 'active',
                },
            };
            const user = yield user_repository_1.UserRepository.getInstance().upsertUser({ options });
            return user;
        });
    }
    createStaff(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fullname, password, email, phone, status, role, otp, clubId, }) {
            const options = {
                data: {
                    fullname,
                    password,
                    email,
                    phone,
                    status,
                    role,
                    otp,
                },
            };
            return yield user_repository_1.UserRepository.getInstance().createNewUser({ options });
        });
    }
}
exports.UserService = UserService;
