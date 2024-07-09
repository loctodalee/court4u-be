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
exports.ClubSubscriptionRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class ClubSubscriptionRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new ClubSubscriptionRepository();
        }
        return this.Instance;
    }
    createClubSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.clubSubscription.create({
                data,
            });
        });
    }
    updateClubSubs(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.clubSubscription.update({
                where: {
                    id,
                },
                data,
            });
        });
    }
    foundClubSubById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.clubSubscription.findFirst({
                where: {
                    id,
                },
            });
        });
    }
    foundClubsubByClubId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.clubSubscription.findFirst({
                where: {
                    clubId: id,
                },
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.clubSubscription.findMany();
        });
    }
}
exports.ClubSubscriptionRepository = ClubSubscriptionRepository;
