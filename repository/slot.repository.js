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
exports.SlotRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class SlotRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SlotRepository();
        }
        return this.Instance;
    }
    addSlot(_a) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, startTime, endTime, dateOfWeek, price, }) {
            var result = yield prisma_1.default.slot.create({
                data: {
                    clubId,
                    startTime,
                    endTime,
                    dateOfWeek,
                    price,
                },
            });
            return result;
        });
    }
    findManySlot(_a) {
        return __awaiter(this, arguments, void 0, function* ({ options }) {
            return yield prisma_1.default.slot.findMany(options);
        });
    }
}
exports.SlotRepository = SlotRepository;
