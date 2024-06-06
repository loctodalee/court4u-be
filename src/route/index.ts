import express, { Request, Response } from 'express';
const router = express.Router();

router.use('/v1/api/user', require('./user'));
router.use('/v1/api/auth', require('./auth'));
router.use('/v1/api/club', require('./club'));
router.use('/v1/api/court', require('./court'));

module.exports = router;
