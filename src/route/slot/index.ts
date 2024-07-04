import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SlotController } from '../../controller/slot.controller';
const router = express.Router();
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
router.post('/', asyncHandler(SlotController.getInstacnce().addSlot));
router.post(
  '/:id/courts',
  asyncHandler(SlotController.getInstacnce().addCourtOnSlot)
);

module.exports = router;
