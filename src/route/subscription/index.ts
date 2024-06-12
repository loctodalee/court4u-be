import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SubscriptionController } from '../../controller/subscription.controller';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
router.post(
  '/owner/create',
  asyncHandler(SubscriptionController.getInstance().createSubscription)
);

module.exports = router;
