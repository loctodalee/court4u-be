import express from 'express';
import { StaffProfileController } from '../../controller/staffProfile.controller';
import { asyncHandler } from '../../helper/asyncHandler';
import { grantAccess } from '../../middleware/rbac';
import { authentication, CheckApiKey } from '../../auth/authUtils';
const router = express.Router();
router.use(authentication);
router.get(
  '',
  grantAccess('readAny', 'staffProfile'),
  asyncHandler(StaffProfileController.getInstance().getStaffProfiles)
);
router.use(CheckApiKey);

router.post(
  '/',
  grantAccess('createAny', 'staffProfile'),
  asyncHandler(StaffProfileController.getInstance().createStaffProfile)
);
module.exports = router;
