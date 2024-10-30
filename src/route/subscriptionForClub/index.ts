import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { SubscriptionForClubController } from '../../controller/subscriptionForClub.controller';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();

router.use(authentication);
router.post(
  '/create',
  grantAccess('createAny', 'subscriptionForClub'),
  asyncHandler(SubscriptionForClubController.getInstance().createSubscription)
);
router.get(
  '/',
  grantAccess('readAny', 'subscriptionForClub'),
  asyncHandler(SubscriptionForClubController.getInstance().getAllSubscription)
);

module.exports = router;
