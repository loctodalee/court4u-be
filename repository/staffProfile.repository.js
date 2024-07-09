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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffProfileRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class StaffProfileRepository {
    static getInstance() {
        if (!StaffProfileRepository.Instance) {
            StaffProfileRepository.Instance = new StaffProfileRepository();
        }
        return StaffProfileRepository.Instance;
    }
    getStaffProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const staffs = yield prisma_1.default.staffProfile.findMany();
            return staffs;
        });
    }
    addStaffProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.staffProfile.create({
                data: {
                    userId: data.userId,
                    clubId: data.clubId,
                },
            });
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.create({
                data: {
                    fullname: data.fullname,
                    password: data.password,
                    email: data.email,
                    phone: data.phone,
                    sex: data.sex,
                    avatarUrl: data.avatarUrl,
                    dateOfBirth: data.dateOfBirth,
                },
            });
        });
    }
}
exports.StaffProfileRepository = StaffProfileRepository;
