import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SubscriptionController } from '../../controller/subscription.controller';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
router.post(
  '/owner/create',
  grantAccess('createOwn', 'subscriptionOption'),
  asyncHandler(SubscriptionController.getInstance().createSubscription)
);

module.exports = router;
