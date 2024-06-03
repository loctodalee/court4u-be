import express, { Request, Response } from 'express';
import { AuthController } from '../../controller/auth.controller';
import { asyncHandler } from '../../helper/asyncHandler';
import passport from 'passport';
const router = express.Router();

router.post(
  '/signup',
  asyncHandler(AuthController.getInstance().sendMailVerify)
);
router.get(
  '/welcome_back',
  asyncHandler(AuthController.getInstance().checkLoginEmailToken)
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);
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
module.exports = router;
