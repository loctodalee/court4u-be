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
exports.BookedSlotRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class BookedSlotRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new BookedSlotRepository();
        }
        return this.Instance;
    }
    createBookedSlot(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.bookedSlot.createMany({
                data,
            });
        });
    }
    getAllBookedSlot() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.bookedSlot.findMany();
        });
    }
    findBookedSlot(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.bookedSlot.findFirst({
                where: {
                    id,
                },
            });
        });
    }
    findBookedSlotByDateAndSlotId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ date, slotId, }) {
            const targetDate = new Date(date);
            const year = targetDate.getFullYear();
            const month = targetDate.getMonth() + 1;
            const day = targetDate.getDate() + 1;
            return yield prisma_1.default.bookedSlot.findMany({
                where: {
                    AND: [
                        {
                            date: {
                                equals: new Date(year, month - 1, day),
                            },
                        },
                        {
                            slotId,
                        },
                    ],
                },
            });
        });
    }
    deleteManyBookedSlot(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.bookedSlot.deleteMany({
                where: {
                    bookingId: bookingId,
                },
            });
        });
    }
    getSlotByBookingId(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.bookedSlot.findMany({
                where: {
                    bookingId,
                },
            });
        });
    }
    updateCheckIn(_a) {
        return __awaiter(this, arguments, void 0, function* ({ bookedSlotId, checkIn, }) {
            return yield prisma_1.default.bookedSlot.update({
                where: {
                    id: bookedSlotId,
                },
                data: {
                    checkedIn: checkIn,
                },
            });
        });
    }
}
exports.BookedSlotRepository = BookedSlotRepository;
