import express from 'express';
const router = express.Router();

router.use('/api/role', require('./role'));
router.use('/api/user', require('./user'));
router.use('/api/auth', require('./auth'));
router.use('/api/clubs', require('./club'));
router.use('/api/court', require('./court'));
router.use('/api/subscriptionForClub', require('./subscriptionForClub'));
router.use('/api/clubSubscription', require('./clubSubscription'));
router.use('/api/subscription', require('./subscription'));
router.use('/api/memberSubscription', require('./memberSubscription'));
router.use('/api/payment', require('./payment'));
router.use('/api/review', require('./review'));
router.use('/api/slots', require('./slot'));
router.use('/api/staffProfile', require('./staffProfile'));
router.use('/api/clubImage', require('./clubImage'));
router.use('/api/bookSlot', require('./bookSlot'));
module.exports = router;
