"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const payment_controller_1 = require("../../controller/payment.controller");
const router = express_1.default.Router();
// router.use(authentication);
router.post('/momo', (0, asyncHandler_1.asyncHandler)(payment_controller_1.PaymentController.getInstance().MomoPayment));
router.get('/momo/PaymentCallBack', (0, asyncHandler_1.asyncHandler)(payment_controller_1.PaymentController.getInstance().MomoCallBack));
module.exports = router;
