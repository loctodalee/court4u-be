import express, { Request, Response } from 'express';
import { UserController } from '../../controller/user.controller';
import { asyncHandler } from '../../helper/asyncHandler';
import { grantAccess } from '../../middleware/rbac';
import { authentication } from '../../auth/authUtils';
const router = express.Router();
router.use(authentication);
router.get(
  '/',
  grantAccess('readAny', 'user'),
  asyncHandler(UserController.getInstance().getAllUser)
);
// router.get('/users', asyncHandler(UserController.getInstance().getUserByEmail));

module.exports = router;
