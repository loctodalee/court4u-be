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
exports.KeyTokenService = void 0;
const keyToken_repository_1 = require("../repository/keyToken.repository");
class KeyTokenService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new KeyTokenService();
        }
        return this.Instance;
    }
    constructor() { }
    upsertKey(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, publicKey, privateKey, refreshToken, }) {
            const options = {
                where: {
                    userId,
                },
                update: {
                    publicKey,
                    privateKey,
                    refreshToken,
                },
                create: {
                    userId,
                    publicKey,
                    privateKey,
                    refreshToken,
                },
            };
            const token = yield KeyTokenService._tokenRepository.upsertKey({ options });
            return token ? token.publicKey : null;
        });
    }
    foundKey(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, }) {
            const found = yield KeyTokenService._tokenRepository.foundKey({ userId });
            return found;
        });
    }
    deleteKeyByUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            const result = yield KeyTokenService._tokenRepository.deleteKeyByUserId({
                userId,
            });
            return result;
        });
    }
    updateKeyToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ currentToken, refreshToken, userId, }) {
            const result = yield KeyTokenService._tokenRepository.updateKeyToken({
                currentToken,
                refreshToken,
                userId,
            });
            return result;
        });
    }
}
exports.KeyTokenService = KeyTokenService;
KeyTokenService._tokenRepository = keyToken_repository_1.KeyTokenRepository.getInstance();
