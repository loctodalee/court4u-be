import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { CourtController } from '../../controller/court.controller';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
router.post('/create', asyncHandler(CourtController.getInstance().createCourt));

module.exports = router;
