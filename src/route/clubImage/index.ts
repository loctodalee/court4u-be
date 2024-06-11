import express from 'express';
import { ClubImageController } from '../../controller/clubImage.controller';
import { asyncHandler } from '../../helper/asyncHandler';
const router = express.Router();

router.get(
  '',
  asyncHandler(ClubImageController.getInstance().getAllClubImages)
);
router.get(
  '/:id',
  asyncHandler(ClubImageController.getInstance().getClubImageById)
);
router.post(
  '/create',
  asyncHandler(ClubImageController.getInstance().createClubImage)
);
router.put(
  '/update',
  asyncHandler(ClubImageController.getInstance().updateClubImage)
);
router.delete(
  '/delete',
  asyncHandler(ClubImageController.getInstance().deleteClubImage)
);
module.exports = router;
