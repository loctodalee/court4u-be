import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { PaymentController } from '../../controller/payment.controller';
const router = express.Router();
// router.use(authentication);
router.post('/momo', asyncHandler(PaymentController.getInstance().MomoPayment));
router.get(
  '/momo/PaymentCallBack',
  asyncHandler(PaymentController.getInstance().MomoCallBack)
);

module.exports = router;
