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
exports.KeyTokenRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class KeyTokenRepository {
    static getInstance() {
        if (!KeyTokenRepository.Instance) {
            KeyTokenRepository.Instance = new KeyTokenRepository();
        }
        return KeyTokenRepository.Instance;
    }
    upsertKey(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options, }) {
            const token = yield prisma_1.default.keyTokens.upsert(options);
            return token !== null && token !== void 0 ? token : null;
        });
    }
    foundKey(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, }) {
            const found = yield prisma_1.default.keyTokens.findFirst({
                where: {
                    userId,
                },
            });
            return found;
        });
    }
    deleteKeyByUserId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId }) {
            const result = yield prisma_1.default.keyTokens.delete({
                where: {
                    userId,
                },
            });
            return result;
        });
    }
    updateKeyToken(_a) {
        return __awaiter(this, arguments, void 0, function* ({ userId, refreshToken, currentToken, }) {
            return yield prisma_1.default.keyTokens.update({
                where: {
                    userId,
                },
                data: {
                    refreshTokenUsed: [
                        ...currentToken.refreshTokenUsed,
                        currentToken.refreshToken,
                    ],
                    refreshToken,
                },
            });
        });
    }
}
exports.KeyTokenRepository = KeyTokenRepository;
