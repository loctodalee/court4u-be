import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SlotController } from '../../controller/slot.controller';
import { grantAccess } from '../../middleware/rbac';
import { createSlotValidation } from '../../validation/slot.validation';
const router = express.Router();
router.get(
  '/slotInfo/:clubId',
  asyncHandler(SlotController.getInstacnce().getSlotInfo)
);
router.get(
  '/getClubs',
  asyncHandler(SlotController.getInstacnce().getClubWithDateTime)
);
router.get(
  '/getCourtBySlotId/:id',
  asyncHandler(SlotController.getInstacnce().getAllCourtsBySlotId)
);

router.post(
  '/getRemainCourt',
  asyncHandler(SlotController.getInstacnce().getRemainCourt)
);
router.use(authentication);
router.use(CheckApiKey);
router.use(grantAccess('createAny', 'slot'));
router.post(
  '/',
  asyncHandler(createSlotValidation),
  asyncHandler(SlotController.getInstacnce().addSlot)
);
router.post(
  '/:id/courts',
  asyncHandler(SlotController.getInstacnce().addCourtOnSlot)
);

module.exports = router;
