import express, { Request, Response } from 'express';
const router = express.Router();

router.use('/v1/api/user', require('./user'));
router.use('/v1/api/auth', require('./auth'));
router.use('/v1/api/club', require('./club'));
router.use('/v1/api/court', require('./court'));
router.use('/v1/api/subscription', require('./subscription'));
router.use('/v1/api/payment', require('./payment'));
router.use('/v1/api/review', require('./review'));
router.use('/v1/api/slot', require('./slot'));

module.exports = router;
