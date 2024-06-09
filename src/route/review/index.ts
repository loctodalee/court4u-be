import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { ReviewController } from '../../controller/review.controller';
const router = express.Router();
router.get('/get', ReviewController.getInstance().getReviewByParentId);

router.use(authentication);
router.post(
  '/create',
  asyncHandler(ReviewController.getInstance().createReview)
);

router.post(
  '/delete',
  asyncHandler(ReviewController.getInstance().deleteReview)
);

module.exports = router;
