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
exports.BookingController = void 0;
const booking_service_1 = require("../service/booking.service");
const bookedSlot_service_1 = require("../service/bookedSlot.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class BookingController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new BookingController();
        }
        return this.Instance;
    }
    createBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Create new booking',
                metaData: yield BookingController.bookingService.createBooking(Object.assign({}, req.body)),
            }).send(res);
        });
    }
    /**
     *
     * @param req {slotList: [{date: Date; slotId: string;}, {date: Date; slotId: string;}, {date: Date; slotId: string;}]}
     * @param res
     */
    bookedSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Book success',
                metaData: yield BookingController.bookedSlotService.createBookedSlot(Object.assign({ userId: req.user.userId }, req.body)),
            }).send(res);
        });
    }
    getAllBookedSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Get all booked slot',
                metaData: yield BookingController.bookedSlotService.getAllBookedSlot(),
            }).send(res);
        });
    }
    getBookedSlotByIdAndDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Get booked slot',
                metaData: yield BookingController.bookedSlotService.getBookedSlotWithDateAndSlotId(Object.assign({}, req.body)),
            }).send(res);
        });
    }
    paymentCallBack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Payment response',
                metaData: yield BookingController.bookedSlotService.paymentCallBack(Object.assign({}, req.query)),
            }).send(res);
        });
    }
    checkIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Checkin Success',
                metaData: yield BookingController.bookedSlotService.updateCheckIn(req.query.bookedSlotId),
            }).send(res);
        });
    }
    updateRemainPrice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Checkin Success',
                metaData: yield BookingController.bookedSlotService.updateRemainMoney(req.params.bookedSlotId, req.body.price),
            }).send(res);
        });
    }
}
exports.BookingController = BookingController;
BookingController.bookingService = booking_service_1.BookingService.getInstance();
BookingController.bookedSlotService = bookedSlot_service_1.BookedSlotService.getInstance();
