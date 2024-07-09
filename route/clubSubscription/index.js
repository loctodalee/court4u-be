"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const clubSubcription_controller_1 = require("../../controller/clubSubcription.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.get('/momo/PaymentCallBack', (0, asyncHandler_1.asyncHandler)(clubSubcription_controller_1.ClubSubscriptionController.getInstance().paymentCallBack));
router.use(authUtils_1.authentication);
router.use('/', (0, rbac_1.grantAccess)('readAny', 'buyClubSubscription'), (0, asyncHandler_1.asyncHandler)(clubSubcription_controller_1.ClubSubscriptionController.getInstance().getAll));
router.use(authUtils_1.CheckApiKey);
router.get('/club', (0, rbac_1.grantAccess)('readOwn', 'buyClubSubscription'), (0, asyncHandler_1.asyncHandler)(clubSubcription_controller_1.ClubSubscriptionController.getInstance().findClubSubsByClubId));
router.post('/buy', (0, rbac_1.grantAccess)('createOwn', 'buyClubSubscription'), (0, asyncHandler_1.asyncHandler)(clubSubcription_controller_1.ClubSubscriptionController.getInstance().clubBuySubscription));
module.exports = router;
