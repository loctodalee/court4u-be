import express, { Request, Response } from 'express';
const router = express.Router();

router.use('/v1/api/user', require('./user'));

module.exports = router;
