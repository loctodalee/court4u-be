import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { CourtController } from '../../controller/court.controller';
import { grantAccess } from '../../middleware/rbac';
import { createCourtValidation } from '../../validation/court.validation';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
// router.post(
//   '/',
//   grantAccess('createOwn', 'court'),
//   asyncHandler(createCourtValidation),
//   asyncHandler(CourtController.getInstance().createCourt)
// );
router.get(
  '/',
  grantAccess('readOwn', 'court'),
  asyncHandler(CourtController.getInstance().getAllCourtByClubId)
);
router.post(
  '/',
  grantAccess('createOwn', 'court'),
  asyncHandler(CourtController.getInstance().createCourtAndAssign)
);
module.exports = router;
