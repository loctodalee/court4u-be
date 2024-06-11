import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SlotController } from '../../controller/slot.controller';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
router.post('/create', asyncHandler(SlotController.getInstacnce().createSlot));

module.exports = router;
