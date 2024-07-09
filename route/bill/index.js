"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const bill_controller_1 = require("../../controller/bill.controller");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.use(authUtils_1.authentication);
router.use(authUtils_1.CheckApiKey);
router.get('/:id', (0, asyncHandler_1.asyncHandler)(bill_controller_1.BillController.getInstance().getBillById));
router.get('/', (0, rbac_1.grantAccess)('readAny', 'bill'), (0, asyncHandler_1.asyncHandler)(bill_controller_1.BillController.getInstance().getAllBill));
module.exports = router;
