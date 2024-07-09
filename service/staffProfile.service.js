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
exports.StaffProfileService = void 0;
const staffProfile_repository_1 = require("../repository/staffProfile.repository");
class StaffProfileService {
    static getInstance() {
        if (!StaffProfileService.Instance) {
            StaffProfileService.Instance = new StaffProfileService();
        }
        return StaffProfileService.Instance;
    }
    getStaffProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const staffProfile = yield staffProfile_repository_1.StaffProfileRepository.getInstance().getStaffProfiles();
            return staffProfile;
        });
    }
    addStaffProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield staffProfile_repository_1.StaffProfileRepository.getInstance().createUser({
                fullname: data.fullname,
                password: data.password,
                email: data.email,
                phone: data.phone,
                sex: data.sex,
                avatarUrl: data.avatarUrl,
                dateOfBirth: data.dateOfBirth,
            });
            var result = yield staffProfile_repository_1.StaffProfileRepository.getInstance().addStaffProfile({
                userId: newUser.id,
                clubId: data.clubId,
            });
            return result;
        });
    }
}
exports.StaffProfileService = StaffProfileService;
