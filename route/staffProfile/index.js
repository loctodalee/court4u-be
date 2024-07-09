"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staffProfile_controller_1 = require("../../controller/staffProfile.controller");
const asyncHandler_1 = require("../../helper/asyncHandler");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.get('', (0, rbac_1.grantAccess)('readAny', 'staffProfile'), (0, asyncHandler_1.asyncHandler)(staffProfile_controller_1.StaffProfileController.getInstance().getStaffProfiles));
router.post('/', (0, rbac_1.grantAccess)('createAny', 'staffProfile'), (0, asyncHandler_1.asyncHandler)(staffProfile_controller_1.StaffProfileController.getInstance().createStaffProfile));
module.exports = router;
