import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
import { DashboardOwnerController } from '../../controller/dashboard.controller.owner';
const router = express.Router();
router.use(authentication);
router.use(grantAccess('readOwn', 'Dashboard.Owner'));
//-------------- SELECT CLUB ---------------//
router.get(
  '/clubs',
  asyncHandler(DashboardOwnerController.getInstance().getClubByOwnerId)
);

router.get(
  '/club/select/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().selectClub)
);
//--------------- CLUB -------------------//
router.use(CheckApiKey);

router.get(
  '/club/',
  asyncHandler(DashboardOwnerController.getInstance().getClubById)
);

//--------------- BILL ---------------------//

router.get(
  '/bill/club/',
  asyncHandler(DashboardOwnerController.getInstance().getBillByClubId)
);

//------------------ Booking ----------------------------//
router.get(
  '/booking/club/',
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
  '/memberSubscription/club/',
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
  '/slot/club/',
  asyncHandler(DashboardOwnerController.getInstance().getSlotsByClubId)
);
//---------------------- Staff profile --------------------//
router.get(
  '/staffProfile/club/',
  asyncHandler(DashboardOwnerController.getInstance().getStaffProfileByClubId)
);

router.post(
  '/staffProfile/club/',
  asyncHandler(DashboardOwnerController.getInstance().createStaffProfile)
);

//--------------------- Subscription Options (subscription cho member) ---------------//
router.get(
  '/subscriptionOption/club/',
  asyncHandler(
    DashboardOwnerController.getInstance().getAllSubscriptionOptionByClubId
  )
);

//----------------------- Booked Slot -------------------------------//
router.get(
  '/bookedSlot/club/',
  asyncHandler(DashboardOwnerController.getInstance().getBookedSlotByClubId)
);

//----------------------- Subscription For Club ---------------- //
router.get(
  '/subscriptionForClub',
  asyncHandler(DashboardOwnerController.getInstance().getAllSubscriptionForClub)
);
module.exports = router;
