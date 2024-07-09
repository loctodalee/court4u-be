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
exports.SlotOnCourtRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class SlotOnCourtRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SlotOnCourtRepository();
        }
        return this.Instance;
    }
    addCourtOnSlot(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.slotOnCourt.create({
                data,
            });
        });
    }
    searchSlotOnCourt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.slotOnCourt.findFirst({
                where: {
                    id,
                },
            });
        });
    }
    getAllSlotOnCourt() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.slotOnCourt.findMany();
        });
    }
    findUniqueSlotOnCourt(_a) {
        return __awaiter(this, arguments, void 0, function* ({ slotId, courtId, }) {
            return yield prisma_1.default.slotOnCourt.findFirst({
                where: {
                    slotId,
                    courtId,
                },
            });
        });
    }
    getAllCourtBySlotId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.slotOnCourt.findMany({
                where: {
                    slotId: id,
                },
            });
        });
    }
}
exports.SlotOnCourtRepository = SlotOnCourtRepository;
