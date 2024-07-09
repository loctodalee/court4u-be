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
exports.BookingRepository = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
class BookingRepository {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new BookingRepository();
        }
        return this.Instance;
    }
    createBooking(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.booking.create({
                data,
            });
        });
    }
    getAllBooking() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.booking.findMany();
        });
    }
    foundBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.booking.findFirst({
                where: {
                    id,
                },
            });
        });
    }
    updateBooking(bookingId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.booking.update({
                where: {
                    id: bookingId,
                },
                data,
            });
        });
    }
    deleteBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.booking.delete({
                where: {
                    id,
                },
            });
        });
    }
}
exports.BookingRepository = BookingRepository;
