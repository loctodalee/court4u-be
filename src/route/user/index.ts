import express, { Request, Response } from 'express';
import { UserController } from '../../controller/user.controller';
import { asyncHandler } from '../../helper/asyncHandler';
const router = express.Router();

router.get('/users', asyncHandler(UserController.getInstance().getUserById));

module.exports = router;
