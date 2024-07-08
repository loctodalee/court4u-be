import express from 'express';
import { StaffProfileController } from '../../controller/staffProfile.controller';
import { asyncHandler } from '../../helper/asyncHandler';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();

router.get(
  '',
  grantAccess('readAny', 'staffProfile'),
  asyncHandler(StaffProfileController.getInstance().getStaffProfiles)
);
router.post(
  '/',
  grantAccess('createAny', 'staffProfile'),
  asyncHandler(StaffProfileController.getInstance().createStaffProfile)
);
module.exports = router;
