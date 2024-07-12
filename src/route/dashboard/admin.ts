import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
import { DashboardAdminController } from '../../controller/dashboard.controller.admin';
const router = express.Router();
router.use(authentication);
router.use(grantAccess('readAny', 'Dashboard.Admin'));

//--------------- CLUB -------------------//
router.get(
  '/club/location',
  asyncHandler(DashboardAdminController.getInstance().findClubByLocation)
);
router.get(
  '/club/:id',
  asyncHandler(DashboardAdminController.getInstance().getClubById)
);

router.get(
  '/club',
  asyncHandler(DashboardAdminController.getInstance().getAllClub)
);

//--------------- BILL ---------------------//

router.get(
  '/bill/club/:clubId',
  asyncHandler(DashboardAdminController.getInstance().getBillByClubId)
);
router.get(
  '/bill/:id',
  asyncHandler(DashboardAdminController.getInstance().getBillById)
);
router.get(
  '/bill',
  asyncHandler(DashboardAdminController.getInstance().getAllBill)
);

//------------------ User ----------------------//
router.get(
  '/member/search',
  asyncHandler(DashboardAdminController.getInstance().getUserByEmail)
);

router.get(
  '/member/:id',
  asyncHandler(DashboardAdminController.getInstance().getUserById)
);
router.get(
  '/member',
  asyncHandler(DashboardAdminController.getInstance().getAllUser)
);

//------------------ Booking ----------------------------//
router.get(
  '/booking/:id',
  asyncHandler(DashboardAdminController.getInstance().getBookingById)
);
router.get(
  '/booking/club/:clubId',
  asyncHandler(DashboardAdminController.getInstance().getBookingByClubId)
);
router.get(
  '/booking',
  asyncHandler(DashboardAdminController.getInstance().getAllBooking)
);

//---------------------- Club Subscription ---------------------//
router.get(
  '/clubSubscription',
  asyncHandler(DashboardAdminController.getInstance().getAllClubSubscription)
);

//--------------- Member Subscription -------------------//
router.get(
  '/memberSubscription/club/:clubId',
  asyncHandler(
    DashboardAdminController.getInstance().getAllMemberSubscriptionByClubId
  )
);

router.get(
  '/memberSubscription/user/:userId',
  asyncHandler(
    DashboardAdminController.getInstance().getMemberSubscriptionByUserId
  )
);

router.get(
  '/memberSubscription',
  asyncHandler(DashboardAdminController.getInstance().getAllMemberSubscription)
);

//--------------------- Slot --------------------//

router.get(
  '/slot/:slotId',
  asyncHandler(DashboardAdminController.getInstance().getCourtOnSlotId)
);
router.get(
  '/slot/club/:clubId',
  asyncHandler(DashboardAdminController.getInstance().getSlotsByClubId)
);
//---------------------- Staff profile --------------------//
router.get(
  '/staffProfile/club/:clubId',
  asyncHandler(DashboardAdminController.getInstance().getStaffProfileByClubId)
);

//--------------------- Subscription Options (subscription cho member) ---------------//
router.get(
  '/subscriptionOption/club/:clubId',
  asyncHandler(
    DashboardAdminController.getInstance().getAllSubscriptionOptionByClubId
  )
);

//----------------------- Booked Slot -------------------------------//
router.get(
  '/bookedSlot/club/:clubId',
  asyncHandler(DashboardAdminController.getInstance().getBookedSlotByClubId)
);

//----------------------- Subscription For Club ---------------- //
router.get(
  '/subscriptionForClub',
  asyncHandler(DashboardAdminController.getInstance().getAllSubscriptionForClub)
);
module.exports = router;
