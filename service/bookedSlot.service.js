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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookedSlotService = void 0;
const slot_repository_1 = require("../repository/slot.repository");
const booking_service_1 = require("./booking.service");
const bill_service_1 = require("./bill.service");
const bookedSlot_repository_1 = require("../repository/bookedSlot.repository");
const memberSubscription_service_1 = require("./memberSubscription.service");
const error_response_1 = require("../handleResponse/error.response");
const subscription_service_1 = require("./subscription.service");
const redis_service_1 = require("./redis.service");
const payment_service_1 = require("./payment.service");
const qrcode_1 = __importDefault(require("qrcode"));
const email_service_1 = require("./email.service");
const user_service_1 = require("./user.service");
const club_service_1 = require("./club.service");
class BookedSlotService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    createBookedSlot(_b) {
        return __awaiter(this, arguments, void 0, function* ({ userId, subscriptionId, slotList, }) {
            // sort để lấy toàn bộ id trong list slotList nhận tự request
            const slotIds = slotList.map((entry) => entry.slotId);
            // sort để lấy ra price của từng slot trong slotList
            const slots = yield _a._slotRepository.findManySlot({
                options: {
                    where: {
                        id: { in: slotIds },
                    },
                },
            });
            //tạo ra nơi để lưu lại full thông tin của 1 bookedSlot
            var bookedSlotInfoList = [];
            var listLockCheck = [
                {
                    date: slotList[0].date,
                    slotId: slotList[0].slotId,
                    quantity: 0,
                },
            ];
            // sort để gán giá của vào từng slot và push vào bookedSlotInfoList
            slots.forEach((slot) => {
                slotList.forEach((data) => {
                    if (slot.id === data.slotId) {
                        bookedSlotInfoList.push({
                            checkedIn: 'pending',
                            date: new Date(data.date),
                            price: slot.price,
                            bookingId: '0',
                            slotId: data.slotId,
                        });
                    }
                });
            });
            slotList.forEach((slot) => {
                listLockCheck.forEach((data) => {
                    console.log(data);
                    if (slot.slotId === data.slotId && slot.date === data.date) {
                        data.quantity += 1;
                    }
                    else {
                        listLockCheck.push({
                            date: slot.date,
                            quantity: 1,
                            slotId: slot.slotId,
                        });
                    }
                });
            });
            console.log(listLockCheck);
            // tính total price để tạo bill
            const totalPrice = bookedSlotInfoList.reduce((sum, slot) => sum + slot.price, 0);
            const totalTime = slots.reduce((sum, slot) => sum + (slot.endTime.getTime() - slot.endTime.getTime()), 0);
            console.log(totalPrice);
            //lock
            const acquireProduct = yield Promise.all(listLockCheck.map((x) => __awaiter(this, void 0, void 0, function* () {
                const keyLock = yield (0, redis_service_1.acquireLock)(x.slotId, x.date, x.quantity);
                if (keyLock) {
                    yield (0, redis_service_1.releaseLock)(keyLock);
                }
                return keyLock ? true : false;
            })));
            console.log(acquireProduct);
            if (acquireProduct.includes(false)) {
                throw new error_response_1.BadRequestError('Booked slot is not valid');
            }
            // nếu pass thì vẫn còn sân để trong slot đó để book
            if (!subscriptionId) {
                const foundClub = yield _a._clubService.foundClubById({
                    clubId: slots[0].clubId,
                });
                if (!foundClub)
                    throw new error_response_1.BadRequestError('Club not found');
                const preOrderCost = (totalPrice * foundClub.preOrder) / 100;
                // nếu không có sử dụng gói để book slot
                const bill = yield _a._billService.createBill({
                    date: new Date(Date.now()),
                    method: 'momo',
                    status: 'pending',
                    total: preOrderCost,
                    type: 'booking',
                });
                const booking = yield _a._bookingService.createBooking({
                    userId,
                    billId: bill.id,
                    date: new Date(Date.now()),
                    totalPrice: totalPrice,
                    status: 'pending',
                });
                // redirect qua payment
                bookedSlotInfoList.forEach((item) => {
                    item.bookingId = booking.id;
                });
                var payment = yield _a._paymentService.momoPayment({
                    price: preOrderCost,
                    orderId: booking.id,
                    returnUrl: '/bookSlots/momo/PaymentCallBack',
                });
                yield _a._bookedSlotRepository.createBookedSlot(bookedSlotInfoList);
                return payment;
            }
            else {
                // có sử dụng subscription để book slot
                // kiểm tra coi subscription có tồn tại không
                const memberSubs = yield _a._memberSubscriptionService.searchSubscription(subscriptionId);
                if (!memberSubs)
                    throw new error_response_1.NotFoundError('Not found subscription');
                const memberSubsType = yield _a._subscriptionService
                    .findSubscriptionById({
                    keySearch: memberSubs.subscriptionId,
                })
                    .then((x) => x === null || x === void 0 ? void 0 : x.type);
                const bill = yield _a._billService.createBill({
                    date: new Date(Date.now()),
                    method: 'subscription',
                    status: 'success',
                    total: totalPrice,
                    type: 'booking',
                });
                const booking = yield _a._bookingService.createBooking({
                    userId,
                    billId: bill.id,
                    date: new Date(Date.now()),
                    totalPrice: totalPrice,
                    status: 'active',
                });
                switch (memberSubsType) {
                    case 'Month': {
                        slotList.forEach((x) => __awaiter(this, void 0, void 0, function* () {
                            const memberSubscription = yield _a._memberSubscriptionService.updateMonthSubscription(memberSubs.id, x.date);
                            if (!memberSubscription) {
                                yield _a._bookingService.deleteBooking(booking.id);
                                yield _a._billService.deleteBill(bill.id);
                                throw new error_response_1.BadRequestError('Out of subscriptions');
                            }
                        }));
                        break;
                    }
                    case 'Time': {
                        yield _a._memberSubscriptionService.updateTimeSubscription(memberSubs.id, totalTime);
                    }
                }
                bookedSlotInfoList.forEach((item) => {
                    item.bookingId = booking.id;
                });
                yield _a._bookedSlotRepository.createBookedSlot(bookedSlotInfoList);
                var bookedSlot = yield _a._bookedSlotRepository.getSlotByBookingId(booking.id);
                var attachments = [];
                var listQRMail = yield Promise.all(bookedSlot.map((x, index) => __awaiter(this, void 0, void 0, function* () {
                    const qrBuffer = yield qrcode_1.default.toBuffer(`http://localhost:8080/api/bookSlots/checkIn?bookedSlotId=${x.id}`);
                    const attachmentId = `qr-${index}.png`;
                    const base64QR = qrBuffer.toString('base64');
                    attachments.push({
                        ContentType: 'image/png',
                        Filename: attachmentId,
                        Base64Content: base64QR,
                        ContentID: attachmentId,
                    });
                    return {
                        date: x.date,
                        price: x.price,
                        QRimg: `<h4>Date: </h4>${x.date}</br><h4>Price: </h4>${x.price}</br><img src="cid:${attachmentId}"/>`,
                    };
                })));
                const content = listQRMail
                    .map((x) => {
                    return x.QRimg;
                })
                    .join('');
                const foundUser = yield _a._userService.getUserById({
                    id: booking.userId,
                });
                if (!foundUser)
                    throw new error_response_1.BadRequestError('user not foud');
                yield _a._emailService.sendEmailConfirmation({
                    email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
                    content,
                    subject: 'Book court confirmation',
                    attachment: attachments,
                });
                return bookedSlot;
            }
        });
    }
    getAllBookedSlot() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._bookedSlotRepository.getAllBookedSlot();
        });
    }
    findBookedSlot(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._bookedSlotRepository.findBookedSlot(id);
        });
    }
    getBookedSlotWithDateAndSlotId(_b) {
        return __awaiter(this, arguments, void 0, function* ({ slotId, date, }) {
            return yield _a._bookedSlotRepository.findBookedSlotByDateAndSlotId({
                slotId,
                date,
            });
        });
    }
    paymentCallBack(avgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId: bookingId, message } = avgs;
            const booking = yield _a._bookingService.foundBooking(bookingId);
            if (!booking)
                throw new error_response_1.BadRequestError('Booking not found!');
            if (message == 'Successful.') {
                const updateBooking = yield _a._bookingService.updateBookingStatus(bookingId, 'active');
                if (!updateBooking)
                    throw new error_response_1.BadRequestError('Update booking fail');
                const billUpdate = yield _a._billService.updateBill(booking.billId, { status: 'success' });
                if (!billUpdate)
                    throw new error_response_1.BadRequestError('Bill update fail');
                var bookedSlot = yield _a._bookedSlotRepository.getSlotByBookingId(booking.id);
                var attachments = [];
                var listQRMail = yield Promise.all(bookedSlot.map((x, index) => __awaiter(this, void 0, void 0, function* () {
                    const qrBuffer = yield qrcode_1.default.toBuffer(`http://localhost:8080/api/bookSlots/checkIn?bookedSlotId=${x.id}`);
                    const attachmentId = `qr-${index}.png`;
                    const base64QR = qrBuffer.toString('base64');
                    attachments.push({
                        ContentType: 'image/png',
                        Filename: attachmentId,
                        Base64Content: base64QR,
                        ContentID: attachmentId,
                    });
                    return {
                        date: x.date,
                        price: x.price,
                        QRimg: `<h4>Date: </h4>${x.date}</br><h4>Price: </h4>${x.price}</br><img src="cid:${attachmentId}"/>`,
                    };
                })));
                const content = listQRMail
                    .map((x) => {
                    return x.QRimg;
                })
                    .join('');
                const foundUser = yield _a._userService.getUserById({
                    id: booking.userId,
                });
                if (!foundUser)
                    throw new error_response_1.BadRequestError('user not foud');
                yield _a._emailService.sendEmailConfirmation({
                    email: foundUser === null || foundUser === void 0 ? void 0 : foundUser.email,
                    content,
                    subject: 'Book court confirmation',
                    attachment: attachments,
                });
                return content;
            }
            else {
                const updateBooking = yield _a._bookingService.updateBookingStatus(bookingId, 'canceled');
                if (!updateBooking)
                    throw new error_response_1.BadRequestError('Update booking fail');
                const billUpdate = yield _a._billService.updateBill(booking.billId, { status: 'fail' });
                if (!billUpdate)
                    throw new error_response_1.BadRequestError('Bill update fail');
                yield _a._bookedSlotRepository.deleteManyBookedSlot(booking.id);
                throw new error_response_1.BadRequestError('Fail at payment');
            }
        });
    }
    updateCheckIn(bookedSlotId) {
        return __awaiter(this, void 0, void 0, function* () {
            //find bookedSlot
            var bookedSlot = yield _a._bookedSlotRepository.findBookedSlot(bookedSlotId);
            if (!bookedSlot)
                throw new error_response_1.BadRequestError('Booked slot not found');
            //find booking
            var foundBooking = yield _a._bookingService.foundBooking(bookedSlot.bookingId);
            if (!foundBooking)
                throw new error_response_1.BadRequestError('Booking Not found');
            //find bill
            var foundBill = yield _a._billService.getBillById(foundBooking.billId);
            if (!foundBill)
                throw new error_response_1.BadRequestError('Bill not found');
            //find remain money
            const remainMoney = foundBooking.totalPrice - foundBill.total;
            //update booked slot checkiIn to "yes"
            if (bookedSlot.checkedIn == 'yes')
                throw new error_response_1.BadRequestError('Booked slot is not available');
            const bookSlot = yield _a._bookedSlotRepository.updateCheckIn({
                bookedSlotId: bookedSlot.id,
                checkIn: 'yes',
            });
            return {
                bookSlot,
                remainMoney,
            };
        });
    }
    updateRemainMoney(bookedSlotId, money) {
        return __awaiter(this, void 0, void 0, function* () {
            var bookedSlot = yield _a._bookedSlotRepository.findBookedSlot(bookedSlotId);
            if (!bookedSlot)
                throw new error_response_1.BadRequestError('Booked slot not found');
            //find booking
            var foundBooking = yield _a._bookingService.foundBooking(bookedSlot.bookingId);
            if (!foundBooking)
                throw new error_response_1.BadRequestError('Booking Not found');
            //find bill
            var foundBill = yield _a._billService.getBillById(foundBooking.billId);
            if (!foundBill)
                throw new error_response_1.BadRequestError('Bill not found');
            //find remain money
            var bookingRemain = yield _a._bookingService.updateBookingPrice(foundBooking.id, foundBooking.totalPrice + money);
            const remainMoney = bookingRemain.totalPrice - foundBill.total;
            return {
                bookingRemain,
                remainMoney,
            };
        });
    }
}
exports.BookedSlotService = BookedSlotService;
_a = BookedSlotService;
(() => {
    _a._memberSubscriptionService = memberSubscription_service_1.MemberSubscriptionService.getInstance();
    _a._bookedSlotRepository = bookedSlot_repository_1.BookedSlotRepository.getInstance();
    _a._billService = bill_service_1.BillService.getInstance();
    _a._bookingService = booking_service_1.BookingService.getInstance();
    _a._slotRepository = slot_repository_1.SlotRepository.getInstance();
    _a._subscriptionService = subscription_service_1.SubscriptionFactory.getInstance();
    _a._paymentService = payment_service_1.PaymentService.getInstance();
    _a._emailService = email_service_1.EmailService.getInstance();
    _a._userService = user_service_1.UserService.getInstance();
    _a._clubService = club_service_1.ClubService.getInstance();
})();
