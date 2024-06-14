import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { ClubSubscriptionController } from '../../controller/clubSubcription.controller';

const router = express.Router();
router.get(
  '/momo/PaymentCallBack',
  asyncHandler(ClubSubscriptionController.getInstance().paymentCallBack)
);
router.use(authentication);
router.use(CheckApiKey);
router.post(
  '/buy',
  asyncHandler(ClubSubscriptionController.getInstance().clubBuySubscription)
);

module.exports = router;
