import express from 'express';
const router = express.Router();

router.use('/api/roles', require('./role'));
router.use('/api/users', require('./user'));
router.use('/api/auth', require('./auth'));
router.use('/api/clubs', require('./club'));
router.use('/api/courts', require('./court'));
router.use('/api/subscriptionForClubs', require('./subscriptionForClub'));
router.use('/api/clubSubscriptions', require('./clubSubscription'));
router.use('/api/subscriptions', require('./subscription'));
router.use('/api/memberSubscriptions', require('./memberSubscription'));
router.use('/api/payments', require('./payment'));
router.use('/api/reviews', require('./review'));
router.use('/api/slots', require('./slot'));
router.use('/api/staffProfiles', require('./staffProfile'));
router.use('/api/clubImages', require('./clubImage'));
router.use('/api/bookSlots', require('./bookSlot'));
router.use('/api/dashboard/admin', require('./dashboard/admin'));
router.use('/api/dashboard/owner', require('./dashboard/owner'));
router.use('/api/dashboard/staff', require('./dashboard/staff'));

module.exports = router;
