import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
import { DashboardOwnerController } from '../../controller/dashboard.controller.owner';
import { createStaffProfileValidation } from '../../validation/staffProfile.validation';
const router = express.Router();
router.use(authentication);
router.use(grantAccess('readOwn', 'Dashboard.Owner'));

router.use(
  '/staffProfile/owner',
  asyncHandler(DashboardOwnerController.getInstance().getStaffProfileByOwnerId)
);
//-------------- SELECT CLUB ---------------//
router.get(
  '/clubs',
  asyncHandler(DashboardOwnerController.getInstance().getClubByOwnerId)
);

router.get(
  '/club/select/:clubId',
  asyncHandler(DashboardOwnerController.getInstance().selectClub)
);
//--------------- Get with out api key ---------------//
router.get(
  '/bills',
  asyncHandler(DashboardOwnerController.getInstance().getBillByCourtOwnerId)
);
//----------------------- Subscription For Club ---------------- //
router.get(
  '/subscriptionForClub',
  asyncHandler(DashboardOwnerController.getInstance().getAllSubscriptionForClub)
);
//--------------- CLUB -------------------//
router.use(CheckApiKey);

router.get(
  '/club',
  asyncHandler(DashboardOwnerController.getInstance().getClubById)
);

//--------------- BILL ---------------------//

router.get(
  '/bill/club',
  asyncHandler(DashboardOwnerController.getInstance().getBillByClubId)
);

//------------------ Booking ----------------------------//
router.get(
  '/booking',
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
  '/memberSubscription',
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
  '/slot',
  asyncHandler(DashboardOwnerController.getInstance().getSlotsByClubId)
);
//---------------------- Staff profile --------------------//
router.get(
  '/staffProfile/',
  asyncHandler(DashboardOwnerController.getInstance().getStaffProfileByClubId)
);

router.post(
  '/staffProfile/',
  asyncHandler(createStaffProfileValidation),
  asyncHandler(DashboardOwnerController.getInstance().createStaffProfile)
);

//--------------------- Subscription Options (subscription cho member) ---------------//
router.get(
  '/subscriptionOption/',
  asyncHandler(
    DashboardOwnerController.getInstance().getAllSubscriptionOptionByClubId
  )
);

//----------------------- Booked Slot -------------------------------//
router.get(
  '/bookedSlot/',
  asyncHandler(DashboardOwnerController.getInstance().getBookedSlotByClubId)
);

module.exports = router;
