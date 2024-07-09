"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffProfileController = void 0;
const staffProfile_service_1 = require("./../service/staffProfile.service");
const { SuccessResponse } = require('../handleResponse/success.response');
const { ErrorResponse } = require('../handleResponse/error.response');
class StaffProfileController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new StaffProfileController();
        }
        return this.Instance;
    }
    //
    getStaffProfiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userService = new staffProfile_service_1.StaffProfileService();
            try {
                const profiles = yield userService.getStaffProfiles();
                new SuccessResponse({
                    message: 'Get Success',
                    metaData: profiles,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error fetching staff profiles',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
    //
    createStaffProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, password, email, phone, sex, avatarUrl, dateOfBirth, clubId, staffRoles, } = req.body;
            try {
                const newProfile = yield staffProfile_service_1.StaffProfileService.getInstance().addStaffProfile({
                    fullname,
                    password,
                    email,
                    phone,
                    sex,
                    avatarUrl,
                    dateOfBirth,
                    clubId,
                });
                new SuccessResponse({
                    message: 'Create Success',
                    metaData: newProfile,
                }).send(res);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                new ErrorResponse({
                    message: 'Error creating staff profile',
                    details: errorMessage,
                }).send(res);
            }
        });
    }
}
exports.StaffProfileController = StaffProfileController;
