import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { ReviewController } from '../../controller/review.controller';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();
router.get('/get', ReviewController.getInstance().getReviewByParentId);

router.use(authentication);
router.post(
  '/create',
  grantAccess('createOwn', 'review'),
  asyncHandler(ReviewController.getInstance().createReview)
);

router.post(
  '/delete',
  grantAccess('deleteOwn', 'review'),
  asyncHandler(ReviewController.getInstance().deleteReview)
);

module.exports = router;
