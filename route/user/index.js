"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../../controller/user.controller");
const asyncHandler_1 = require("../../helper/asyncHandler");
const rbac_1 = require("../../middleware/rbac");
const authUtils_1 = require("../../auth/authUtils");
const router = express_1.default.Router();
router.use(authUtils_1.authentication);
router.get('/', (0, rbac_1.grantAccess)('readAny', 'user'), (0, asyncHandler_1.asyncHandler)(user_controller_1.UserController.getInstance().getAllUser));
// router.get('/users', asyncHandler(UserController.getInstance().getUserByEmail));
module.exports = router;
