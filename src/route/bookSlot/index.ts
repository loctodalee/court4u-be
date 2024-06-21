import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { BookingController } from '../../controller/booking.controller';
const router = express.Router();
router.use(authentication);
router.post(
  '/checkout',
  asyncHandler(BookingController.getInstance().bookedSlot)
);

module.exports = router;
