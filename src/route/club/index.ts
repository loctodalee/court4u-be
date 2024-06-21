import { ClubController } from './../../controller/club.controller';
import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication } from '../../auth/authUtils';
const router = express.Router();
router.use(authentication);
router.post('/create', asyncHandler(ClubController.getInstance().createClub));
router.get('/', asyncHandler(ClubController.getInstance().findClub));
module.exports = router;
