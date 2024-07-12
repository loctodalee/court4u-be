import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
import { DashboardOwnerController } from '../../controller/dashboard.controller.owner';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
router.use(grantAccess('readOwn', 'Dashboard.Owner'));

//--------------- CLUB -------------------//

router.get(
  '/club/:id',
  asyncHandler(DashboardOwnerController.getInstance().getClubById)
);

//--------------- BILL ---------------------//

router.get(
  '/bill/club/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().getBillByClubId)
);

//------------------ Booking ----------------------------//
router.get(
  '/booking/club/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().getBookingByClubId)
);

//---------------------- Club Subscription ---------------------//
router.get(
  '/clubSubscription',
  asyncHandler(
    DashboardOwnerController.getInstance().getClubSubscriptionByClubId
  )
);

//--------------- Member Subscription -------------------//
router.get(
  '/memberSubscription/club/:clubId',
  asyncHandler(
    DashboardOwnerController.getInstance().getAllMemberSubscriptionByClubId
  )
);

//--------------------- Slot --------------------//

router.get(
  '/slot/:slotId',
  asyncHandler(DashboardOwnerController.getInstance().getCourtOnSlotId)
);
router.get(
  '/slot/club/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().getSlotsByClubId)
);
//---------------------- Staff profile --------------------//
router.get(
  '/staffProfile/club/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().getStaffProfileByClubId)
);

//--------------------- Subscription Options (subscription cho member) ---------------//
router.get(
  '/subscriptionOption/club/:clubId',
  asyncHandler(
    DashboardOwnerController.getInstance().getAllSubscriptionOptionByClubId
  )
);

//----------------------- Booked Slot -------------------------------//
router.get(
  '/bookedSlot/club/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().getBookedSlotByClubId)
);

//----------------------- Subscription For Club ---------------- //
router.get(
  '/subscriptionForClub',
  asyncHandler(DashboardOwnerController.getInstance().getAllSubscriptionForClub)
);
module.exports = router;
