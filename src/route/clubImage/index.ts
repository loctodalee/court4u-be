import express from 'express';
import { ClubImageController } from '../../controller/clubImage.controller';
import { asyncHandler } from '../../helper/asyncHandler';
import { authenticate } from 'passport';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();

router.get(
  '',
  asyncHandler(ClubImageController.getInstance().getAllClubImages)
);
router.get(
  '/:id',
  asyncHandler(ClubImageController.getInstance().getClubImageById)
);
router.use(authentication);
router.use(CheckApiKey);
router.post(
  '/create',
  grantAccess('createOwn', 'clubImg'),
  asyncHandler(ClubImageController.getInstance().createClubImage)
);
router.put(
  '/update',
  grantAccess('updateOwn', 'clubImg'),
  asyncHandler(ClubImageController.getInstance().updateClubImage)
);
router.delete(
  '/delete',
  grantAccess('deleteOwn', 'clubImg'),
  asyncHandler(ClubImageController.getInstance().deleteClubImage)
);
module.exports = router;
