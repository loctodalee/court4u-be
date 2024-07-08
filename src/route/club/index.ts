import { ClubController } from './../../controller/club.controller';
import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
const router = express.Router();

router.get('/location', asyncHandler(ClubController.getInstance().searchClub));
router.get(
  '/id/:clubId?',
  asyncHandler(ClubController.getInstance().getSlotInfoByClubIdAndDate)
);
router.get('/:clubId', asyncHandler(ClubController.getInstance().findClub));
router.get('/', asyncHandler(ClubController.getInstance().getClubs));
router.use(authentication);
router.post(
  '/',
  grantAccess('createOwn', 'club'),
  asyncHandler(ClubController.getInstance().createClub)
);

router.use(CheckApiKey);
router.post(
  '/:id',
  grantAccess('updateOwn', 'club'),
  asyncHandler(ClubController.getInstance().updateClub)
);
router.delete(
  '/:id',
  grantAccess('deleteOwn', 'club'),
  asyncHandler(ClubController.getInstance().deleteClub)
);
module.exports = router;
