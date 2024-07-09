"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controller/auth.controller");
const asyncHandler_1 = require("../../helper/asyncHandler");
const passport_1 = __importDefault(require("passport"));
const authUtils_1 = require("../../auth/authUtils");
const router = express_1.default.Router();
router.post('/signup', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().sendMailVerify));
router.post('/owner/signup', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().signUpCourtOwner));
router.post('/login', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().Login));
router.get('/welcome_back', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().checkLoginEmailToken));
// router.get(
//   '/google',
//   passport.authenticate('google', {
//     scope: ['profile', 'email'],
//   })
// );
router.get('/google', auth_controller_1.AuthController.getInstance().LoginGoogle);
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().LoginThirdParty));
router.get('/facebook', passport_1.default.authenticate('facebook', {
    scope: ['email'],
}));
router.get('/facebook/callback', passport_1.default.authenticate('facebook', { failureRedirect: '/login' }), (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().LoginThirdParty));
router.use(authUtils_1.authentication);
router.post('/handleRefreshToken', (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.getInstance().handleRefreshToken));
module.exports = router;
