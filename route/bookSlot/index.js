"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const booking_controller_1 = require("../../controller/booking.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.get('/momo/PaymentCallBack', (0, asyncHandler_1.asyncHandler)(booking_controller_1.BookingController.getInstance().paymentCallBack));
router.use(authUtils_1.authentication);
router.post('/checkout', (0, rbac_1.grantAccess)('createOwn', 'bookSlot'), (0, asyncHandler_1.asyncHandler)(booking_controller_1.BookingController.getInstance().bookedSlot));
// router.post(
//   '/getByDateAndSlotId',
//   asyncHandler(BookingController.getInstance().getBookedSlotByIdAndDate)
// );
router.get('/checkIn', (0, rbac_1.grantAccess)('createOwn', 'checkIn'), (0, asyncHandler_1.asyncHandler)(booking_controller_1.BookingController.getInstance().checkIn));
// router.post(
//   '/updateRemain/:bookedSlotId',
//   asyncHandler(BookingController.getInstance().updateRemainPrice)
// );
module.exports = router;
