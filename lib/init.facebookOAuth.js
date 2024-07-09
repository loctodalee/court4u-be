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
const passport_1 = __importDefault(require("passport"));
const user_service_1 = require("../service/user.service");
const FacebookStrategy = require('passport-facebook').Strategy;
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/api/auth/facebook/callback',
    profileFields: ['id', 'email', 'name', 'displayName', 'photos'],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var _userService = new user_service_1.UserService();
        let user = yield _userService.createOrUpdateFacebookUser({
            avatarUrl: profile.photos[0].value,
            email: profile.emails[0].value,
            facebookAccessToken: accessToken,
            facebookId: profile.id,
            fullname: profile.displayName,
        });
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
})));
exports.default = passport_1.default;
