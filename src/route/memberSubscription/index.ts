import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { MemberSubscriptionController } from '../../controller/memberSubscription.controller';
const router = express.Router();
router.get(
  '/momo/PaymentCallBack',
  asyncHandler(MemberSubscriptionController.getInstance().paymentCallBack)
);
router.use(authentication);
router.post(
  '/buy',
  asyncHandler(MemberSubscriptionController.getInstance().buyMemberSubscription)
);

module.exports = router;
