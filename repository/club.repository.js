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
exports.ClubRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ClubRepository {
    static getInstance() {
        if (!ClubRepository.Instance) {
            ClubRepository.Instance = new ClubRepository();
        }
        return ClubRepository.Instance;
    }
    addClub(_a) {
        return __awaiter(this, arguments, void 0, function* ({ courtOwnerId, name, address, district, cityOfProvince, logoUrl, description, preOrder, }) {
            return yield prisma_1.default.club.create({
                data: {
                    courtOwnerId,
                    address,
                    cityOfProvince,
                    district,
                    name,
                    description,
                    logoUrl,
                    preOrder,
                },
            });
        });
    }
    foundClub(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options }) {
            return yield prisma_1.default.club.findFirst(options);
        });
    }
    getClubs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.club.findMany();
        });
    }
    updateClub(clubId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.club.update({
                where: {
                    id: clubId,
                },
                data,
            });
        });
    }
    deleteClub(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            return yield prisma_1.default.club.update({
                where: {
                    id,
                },
                data: {
                    status: 'disable',
                },
            });
        });
    }
    searchClub(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.club.findMany({
                where: Object.assign({}, data),
            });
        });
    }
}
exports.ClubRepository = ClubRepository;
