"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const memberSubscription_controller_1 = require("../../controller/memberSubscription.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.get('/momo/PaymentCallBack', (0, asyncHandler_1.asyncHandler)(memberSubscription_controller_1.MemberSubscriptionController.getInstance().paymentCallBack));
router.use(authUtils_1.authentication);
router.post('/buy', (0, rbac_1.grantAccess)('createOwn', 'buyMemberSubscription'), (0, asyncHandler_1.asyncHandler)(memberSubscription_controller_1.MemberSubscriptionController.getInstance().buyMemberSubscription));
router.use(authUtils_1.CheckApiKey);
router.get('/:id', (0, rbac_1.grantAccess)('readOwn', 'buyMemberSubscription'), (0, asyncHandler_1.asyncHandler)(memberSubscription_controller_1.MemberSubscriptionController.getInstance().findBySubscriptionId));
module.exports = router;
