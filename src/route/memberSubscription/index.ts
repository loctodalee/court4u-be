import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { MemberSubscriptionController } from '../../controller/memberSubscription.controller';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();
router.get(
  '/momo/PaymentCallBack',
  asyncHandler(MemberSubscriptionController.getInstance().paymentCallBack)
);
router.use(authentication);

router.post(
  '/buy',
  grantAccess('createOwn', 'buyMemberSubscription'),
  asyncHandler(MemberSubscriptionController.getInstance().buyMemberSubscription)
);
router.get(
  '/find/:clubId',
  asyncHandler(MemberSubscriptionController.getInstance().findExisted)
);
router.use(CheckApiKey);
router.get(
  '/:id',
  grantAccess('readOwn', 'buyMemberSubscription'),
  asyncHandler(MemberSubscriptionController.getInstance().findBySubscriptionId)
);

module.exports = router;
