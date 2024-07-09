"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const subscription_controller_1 = require("../../controller/subscription.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.use(authUtils_1.authentication);
router.use(authUtils_1.CheckApiKey);
router.post('/owner/create', (0, rbac_1.grantAccess)('createOwn', 'subscriptionOption'), (0, asyncHandler_1.asyncHandler)(subscription_controller_1.SubscriptionController.getInstance().createSubscription));
module.exports = router;
