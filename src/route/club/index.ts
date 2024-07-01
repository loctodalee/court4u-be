import { ClubController } from './../../controller/club.controller';
import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
const router = express.Router();

router.get('/:clubId', asyncHandler(ClubController.getInstance().findClub));
router.get('/', asyncHandler(ClubController.getInstance().getClubs));

router.use(authentication);
router.use(CheckApiKey);
router.post('/:id', asyncHandler(ClubController.getInstance().updateClub));
router.delete('/:id', asyncHandler(ClubController.getInstance().deleteClub));
router.post('/', asyncHandler(ClubController.getInstance().createClub));
module.exports = router;
