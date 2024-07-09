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
exports.CheckApiKey = exports.authentication = exports.createTokenPair = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const asyncHandler_1 = require("../helper/asyncHandler");
const error_response_1 = require("../handleResponse/error.response");
const keyToken_service_1 = require("../service/keyToken.service");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_decode_1 = require("jwt-decode");
const createTokenPair = (_a) => __awaiter(void 0, [_a], void 0, function* ({ payload, publicKey, privateKey, }) {
    try {
        const accessToken = yield jsonwebtoken_1.default.sign(payload, publicKey, {
            expiresIn: '1 days',
        });
        const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            expiresIn: '3 days',
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        throw error;
    }
});
exports.createTokenPair = createTokenPair;
exports.authentication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, jwt_decode_1.jwtDecode)(req.headers['authorization']);
    const userId = decoded.userId;
    const _keyTokenService = new keyToken_service_1.KeyTokenService();
    if (typeof userId !== 'string')
        throw new error_response_1.AuthFailure('Not found client id');
    const keyStore = yield _keyTokenService.foundKey({
        userId: userId,
    });
    if (!keyStore)
        throw new error_response_1.AuthFailure('Key Store not found');
    const refreshToken = req.headers['refresh-token'];
    // If login with access token is fail, use refresh token to login
    if (refreshToken) {
        if (Array.isArray(refreshToken)) {
            throw new error_response_1.AuthFailure('Invalid refresh token format');
        }
        try {
            const decodeUser = (yield jsonwebtoken_1.default.verify(refreshToken, keyStore.privateKey));
            if (userId !== decodeUser.userId) {
                throw new error_response_1.AuthFailure('Invalid user');
            }
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            req.keyStores = keyStore;
        }
        catch (error) {
            throw new error_response_1.AuthFailure('auth error');
        }
    }
    const accessToken = req.headers['authorization'];
    if (!accessToken) {
        throw new error_response_1.AuthFailure('Invalid request');
    }
    try {
        const decodeUser = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId) {
            throw new error_response_1.AuthFailure('Invalid user');
        }
        req.user = decodeUser;
        req.keyStores = keyStore;
        next();
    }
    catch (error) {
        throw error;
    }
}));
exports.CheckApiKey = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const apikey = req.headers['api-key'];
        if (!apikey)
            throw new error_response_1.BadRequestError('Api key is require for this action');
        const club = yield prisma_1.default.club.findFirst({
            where: {
                apiKey: apikey,
            },
        });
        if (!club)
            throw new error_response_1.BadRequestError('Club not found');
        req.clubId = club.id;
        next();
    }
    catch (error) {
        throw error;
    }
}));
