import express, { Request, Response } from 'express';
import { AuthController } from '../../controller/auth.controller';
import { asyncHandler } from '../../helper/asyncHandler';
import passport from 'passport';
import { authentication } from '../../auth/authUtils';
import {
  loginValidation,
  signUpNewUser,
} from '../../validation/user.validation';
const router = express.Router();

router.post(
  '/signup',
  asyncHandler(signUpNewUser),
  asyncHandler(AuthController.getInstance().sendMailVerify)
);

router.post(
  '/owner/signup',
  asyncHandler(signUpNewUser),
  asyncHandler(AuthController.getInstance().signUpCourtOwner)
);

router.post(
  '/login',
  asyncHandler(loginValidation),
  asyncHandler(AuthController.getInstance().Login)
);

router.get(
  '/welcome_back',
  asyncHandler(AuthController.getInstance().checkLoginEmailToken)
);
router.get(
  '/staff/welcome_back',
  asyncHandler(AuthController.getInstance().checkLoginStaffEmailToken)
);
router.get(
  '/owner/welcome_back',
  asyncHandler(AuthController.getInstance().checkLoginOwnerEmailToken)
);

router.get('/google', AuthController.getInstance().LoginGoogle);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  asyncHandler(AuthController.getInstance().LoginThirdParty)
);

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email'],
  })
);

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  asyncHandler(AuthController.getInstance().LoginThirdParty)
);
router.use(authentication);
router.post(
  '/handleRefreshToken',
  asyncHandler(AuthController.getInstance().handleRefreshToken)
);
router.get('/logout', asyncHandler(AuthController.getInstance().logout));
module.exports = router;
