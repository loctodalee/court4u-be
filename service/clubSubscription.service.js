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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClubSubscriptionService = void 0;
const clubSubscription_repository_1 = require("../repository/clubSubscription.repository");
const club_service_1 = require("./club.service");
const error_response_1 = require("../handleResponse/error.response");
const subscriptionForClub_service_1 = require("./subscriptionForClub.service");
const payment_service_1 = require("./payment.service");
const bill_service_1 = require("./bill.service");
class ClubSubscriptionService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    buySubscription(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, subscriptionForClubId, status = 'pending', }) {
            const foundClub = yield _a._clubService.foundClubById({
                clubId,
            });
            if (!foundClub)
                throw new error_response_1.NotFoundError('Club not found');
            const foundSub = yield _a._subscriptionForClubService.searchById(subscriptionForClubId);
            if (!foundSub)
                throw new error_response_1.NotFoundError('Subscription not found');
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            switch (foundSub.type) {
                case 'Month':
                    endDate.setMonth(currentDate.getMonth() + foundSub.totalDate);
                    break;
                case 'Day':
                    endDate.setDate(currentDate.getDate() + foundSub.totalDate);
                    break;
                case 'Year':
                    endDate.setFullYear(currentDate.getFullYear() + foundSub.totalDate);
            }
            const curretDate = Date.now();
            const bill = yield _a._billService.createBill({
                method: 'momo',
                total: foundSub.price,
                date: new Date(Date.now()),
                status: 'pending',
                type: 'ownerSubscription',
            });
            const result = yield _a._clubSubsriptionRepo.createClubSubscription({
                clubId,
                subscriptionForClubId,
                billId: bill.id,
                name: foundSub.name,
                price: foundSub.price,
                totalDate: foundSub.totalDate,
                startDate: new Date(curretDate),
                endDate,
                status,
            });
            if (!result)
                throw new error_response_1.BadRequestError();
            const payment = yield _a._paymentService.momoPayment({
                price: result.price,
                orderId: result.id,
                returnUrl: '/clubSubscription/momo/PaymentCallBack',
            });
            return payment;
        });
    }
    paymentCallBack(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, message } = args;
            const clubSubscription = yield _a._clubSubsriptionRepo.foundClubSubById(orderId);
            if (!clubSubscription)
                throw new error_response_1.BadRequestError('Not found club subcription');
            const bill = yield _a._billService.getBillById(clubSubscription.billId);
            if (!bill)
                throw new error_response_1.BadRequestError('Not found bill');
            if (message === 'Successful.') {
                const updateClubSub = yield _a._clubSubsriptionRepo.updateClubSubs(clubSubscription.id, { status: 'active' });
                yield _a._billService.updateBill(bill.id, {
                    status: 'success',
                });
                yield _a._clubService.updateClub(updateClubSub.clubId, {
                    status: 'active',
                });
                return updateClubSub;
            }
            else {
                yield _a._clubSubsriptionRepo.updateClubSubs(clubSubscription.id, {
                    status: 'disable',
                });
                yield _a._billService.updateBill(bill.id, {
                    status: 'fail',
                });
                throw new error_response_1.BadRequestError('Payment fail');
            }
        });
    }
    findClubSubsByClubId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield _a._clubSubsriptionRepo.foundClubsubByClubId(id);
            if (!result)
                throw new error_response_1.NotFoundError('No subscription found');
            return result;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._clubSubsriptionRepo.getAll();
        });
    }
}
exports.ClubSubscriptionService = ClubSubscriptionService;
_a = ClubSubscriptionService;
(() => {
    _a._clubSubsriptionRepo = clubSubscription_repository_1.ClubSubscriptionRepository.getInstance();
    _a._clubService = club_service_1.ClubService.getInstance();
    _a._subscriptionForClubService = subscriptionForClub_service_1.SubscriptionForClubService.getInstance();
    _a._paymentService = payment_service_1.PaymentService.getInstance();
    _a._billService = bill_service_1.BillService.getInstance();
})();
