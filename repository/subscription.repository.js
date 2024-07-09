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
exports.SubscriptionRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class SubscriptionRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SubscriptionRepository();
        }
        return this.Instance;
    }
    searchSubscriptions(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options, }) {
            return yield prisma_1.default.subscriptionOption.findMany(options);
        });
    }
    findSubscriptionOption(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options, }) {
            return yield prisma_1.default.subscriptionOption.findFirst(options);
        });
    }
    findSubscriptionDetail(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options, }) {
            return yield prisma_1.default.subscriptionDetail.findFirst(options);
        });
    }
    createSubscription(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, clubId, name, price, totalDate, status, type, }) {
            return yield prisma_1.default.subscriptionOption.create({
                data: {
                    id: id,
                    clubId,
                    name,
                    price,
                    totalDate,
                    status,
                    type,
                },
            });
        });
    }
    createSubscriptionMonth(_a) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, usesPerDay, playTime, }) {
            return yield prisma_1.default.subscriptionDetail.create({
                data: {
                    clubId,
                    playTime,
                    usesPerDay,
                    status: 'active',
                },
            });
        });
    }
    createSubscriptionTime(_a) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, totalTime, }) {
            return yield prisma_1.default.subscriptionDetail.create({
                data: {
                    clubId,
                    totalTime,
                    status: 'active',
                },
            });
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
