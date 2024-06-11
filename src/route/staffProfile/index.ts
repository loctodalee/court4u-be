import express from 'express';
import { StaffProfileController } from '../../controller/staffProfile.controller';
import { asyncHandler } from '../../helper/asyncHandler';
const router = express.Router();

router.get(
  '',
  asyncHandler(StaffProfileController.getInstance().getStaffProfiles)
);
router.post(
  '/create',
  asyncHandler(StaffProfileController.getInstance().createStaffProfile)
);
module.exports = router;
