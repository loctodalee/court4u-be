import express from 'express';
import { PricingController } from '../../controller/pricing.controller';
import { asyncHandler } from '../../helper/asyncHandler';
const router = express.Router();

router.get('', asyncHandler(PricingController.getInstance().getAllPricing));
router.get(
  '/:id',
  asyncHandler(PricingController.getInstance().getPricingById)
);
router.post(
  '/create',
  asyncHandler(PricingController.getInstance().createPricing)
);
router.put(
  '/update',
  asyncHandler(PricingController.getInstance().updatePricing)
);
router.delete(
  '/delete',
  asyncHandler(PricingController.getInstance().deletePricing)
);
module.exports = router;
