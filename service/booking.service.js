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
exports.BookingService = void 0;
const booking_repository_1 = require("../repository/booking.repository");
class BookingService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new BookingService();
        }
        return this.Instance;
    }
    createBooking(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BookingService._bookingRepository.createBooking(data);
        });
    }
    getAllBooking() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BookingService._bookingRepository.getAllBooking();
        });
    }
    foundBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BookingService._bookingRepository.foundBooking(id);
        });
    }
    updateBookingStatus(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BookingService._bookingRepository.updateBooking(bookingId, {
                status,
            });
        });
    }
    updateBookingPrice(bookingId, price) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield BookingService._bookingRepository.updateBooking(bookingId, {
                totalPrice: price,
            });
        });
    }
    deleteBooking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield BookingService._bookingRepository.deleteBooking(id);
        });
    }
}
exports.BookingService = BookingService;
BookingService._bookingRepository = booking_repository_1.BookingRepository.getInstance();
