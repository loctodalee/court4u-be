import express from 'express';
import { asyncHandler } from '../../helper/asyncHandler';
import { authentication, CheckApiKey } from '../../auth/authUtils';
import { grantAccess } from '../../middleware/rbac';
import { DashboardStaffController } from '../../controller/dashboard.controller.staff';
const router = express.Router();
router.use(authentication);
router.use(CheckApiKey);
router.use(grantAccess('readOwn', 'Dashboard.Staff'));

//--------------- CLUB -------------------//

router.get(
  '/club/:id',
  asyncHandler(DashboardStaffController.getInstance().getClubById)
);

//------------------ Booking ----------------------------//
router.get(
  '/booking/club/:clubId',
  asyncHandler(DashboardStaffController.getInstance().getBookingByClubId)
);

//--------------------- Slot --------------------//

router.get(
  '/slot/:slotId',
  asyncHandler(DashboardStaffController.getInstance().getCourtOnSlotId)
);
router.get(
  '/slot/club/:clubId',
  asyncHandler(DashboardStaffController.getInstance().getSlotsByClubId)
);
//---------------------- Staff profile --------------------//
router.get(
  '/staffProfile/club/:clubId',
  asyncHandler(DashboardStaffController.getInstance().getStaffProfileByClubId)
);

//----------------------- Booked Slot -------------------------------//
router.get(
  '/bookedSlot/club/:clubId',
  asyncHandler(DashboardStaffController.getInstance().getBookedSlotByClubId)
);

//----------------------- Subscription For Club ---------------- //
router.get(
  '/subscriptionForClub',
  asyncHandler(DashboardStaffController.getInstance().getAllSubscriptionForClub)
);
module.exports = router;
