import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { BookingController } from '../../controller/booking.controller';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();
router.get(
  '/momo/PaymentCallBack',
  asyncHandler(BookingController.getInstance().paymentCallBack)
);
router.use(authentication);
router.post(
  '/checkout',
  grantAccess('createOwn', 'bookSlot'),
  asyncHandler(BookingController.getInstance().bookedSlot)
);
// router.post(
//   '/getByDateAndSlotId',
//   asyncHandler(BookingController.getInstance().getBookedSlotByIdAndDate)
// );

router.get(
  '/checkIn',
  grantAccess('createOwn', 'checkIn'),
  asyncHandler(BookingController.getInstance().checkIn)
);
// router.post(
//   '/updateRemain/:bookedSlotId',
//   asyncHandler(BookingController.getInstance().updateRemainPrice)
// );

module.exports = router;
