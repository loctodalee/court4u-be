import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SubscriptionForClubController } from '../../controller/subscriptionForClub.controller';
const router = express.Router();

router.use(authentication);
router.post(
  '/create',
  asyncHandler(SubscriptionForClubController.getInstance().createSubscription)
);
router.get(
  '/',
  asyncHandler(SubscriptionForClubController.getInstance().getAllSubscription)
);

module.exports = router;
