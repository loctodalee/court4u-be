import express, { Request, Response } from 'express';
import { AuthController } from '../../controller/auth.controller';
import { asyncHandler } from '../../helper/asyncHandler';
const router = express.Router();

router.post(
  '/signup',
  asyncHandler(AuthController.getInstance().sendMailVerify)
);
router.get(
  '/welcome_back',
  asyncHandler(AuthController.getInstance().checkLoginEmailToken)
);
module.exports = router;
