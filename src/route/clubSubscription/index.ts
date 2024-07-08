import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { ClubSubscriptionController } from '../../controller/clubSubcription.controller';
import { grantAccess } from '../../middleware/rbac';

const router = express.Router();
router.get(
  '/momo/PaymentCallBack',
  asyncHandler(ClubSubscriptionController.getInstance().paymentCallBack)
);
router.use(authentication);
router.use(
  '/',
  grantAccess('readAny', 'buyClubSubscription'),
  asyncHandler(ClubSubscriptionController.getInstance().getAll)
);
router.use(CheckApiKey);
router.get(
  '/club',
  grantAccess('readOwn', 'buyClubSubscription'),
  asyncHandler(ClubSubscriptionController.getInstance().findClubSubsByClubId)
);
router.post(
  '/buy',
  grantAccess('createOwn', 'buyClubSubscription'),
  asyncHandler(ClubSubscriptionController.getInstance().clubBuySubscription)
);

module.exports = router;
