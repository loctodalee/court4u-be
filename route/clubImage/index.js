"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clubImage_controller_1 = require("../../controller/clubImage.controller");
const asyncHandler_1 = require("../../helper/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const rbac_1 = require("../../middleware/rbac");
const router = express_1.default.Router();
router.get('', (0, asyncHandler_1.asyncHandler)(clubImage_controller_1.ClubImageController.getInstance().getAllClubImages));
router.get('/:id', (0, asyncHandler_1.asyncHandler)(clubImage_controller_1.ClubImageController.getInstance().getClubImageById));
router.use(authUtils_1.authentication);
router.use(authUtils_1.CheckApiKey);
router.post('/create', (0, rbac_1.grantAccess)('createOwn', 'clubImg'), (0, asyncHandler_1.asyncHandler)(clubImage_controller_1.ClubImageController.getInstance().createClubImage));
router.put('/update', (0, rbac_1.grantAccess)('updateOwn', 'clubImg'), (0, asyncHandler_1.asyncHandler)(clubImage_controller_1.ClubImageController.getInstance().updateClubImage));
router.delete('/delete', (0, rbac_1.grantAccess)('deleteOwn', 'clubImg'), (0, asyncHandler_1.asyncHandler)(clubImage_controller_1.ClubImageController.getInstance().deleteClubImage));
module.exports = router;
