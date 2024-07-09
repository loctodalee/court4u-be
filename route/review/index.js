"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const review_controller_1 = require("../../controller/review.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.get('/get', review_controller_1.ReviewController.getInstance().getReviewByParentId);
router.use(authUtils_1.authentication);
router.post('/create', (0, rbac_1.grantAccess)('createOwn', 'review'), (0, asyncHandler_1.asyncHandler)(review_controller_1.ReviewController.getInstance().createReview));
router.post('/delete', (0, rbac_1.grantAccess)('deleteOwn', 'review'), (0, asyncHandler_1.asyncHandler)(review_controller_1.ReviewController.getInstance().deleteReview));
module.exports = router;
