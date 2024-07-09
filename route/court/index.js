"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const court_controller_1 = require("../../controller/court.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.use(authUtils_1.authentication);
router.use(authUtils_1.CheckApiKey);
router.post('/', (0, rbac_1.grantAccess)('createOwn', 'court'), (0, asyncHandler_1.asyncHandler)(court_controller_1.CourtController.getInstance().createCourt));
router.get('/', (0, rbac_1.grantAccess)('readOwn', 'court'), (0, asyncHandler_1.asyncHandler)(court_controller_1.CourtController.getInstance().getAllCourtByClubId));
module.exports = router;
