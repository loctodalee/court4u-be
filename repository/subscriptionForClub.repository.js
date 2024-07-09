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
exports.SubscriptionForClubRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class SubscriptionForClubRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SubscriptionForClubRepository();
        }
        return this.Instance;
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.subscriptionForClub.findMany();
        });
    }
    searchById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.subscriptionForClub.findFirst({
                where: {
                    id,
                },
            });
        });
    }
    createNewSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.subscriptionForClub.create({
                data,
            });
        });
    }
    updateSubscription(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.subscriptionForClub.update({
                where: {
                    id,
                },
                data,
            });
        });
    }
}
exports.SubscriptionForClubRepository = SubscriptionForClubRepository;
