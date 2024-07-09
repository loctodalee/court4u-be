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
exports.MemberSubscriptionService = void 0;
const subscription_service_1 = require("./subscription.service");
const error_response_1 = require("../handleResponse/error.response");
const user_service_1 = require("./user.service");
const payment_service_1 = require("./payment.service");
const bill_service_1 = require("./bill.service");
const memberSubscription_repository_1 = require("../repository/memberSubscription.repository");
class MemberSubscriptionService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    buySubscription(_b) {
        return __awaiter(this, arguments, void 0, function* ({ subscriptionId, memberId, }) {
            const foundSubs = yield _a._subscriptionService.findSubscriptionById({
                keySearch: subscriptionId,
            });
            if (!foundSubs)
                throw new error_response_1.BadRequestError('Subscription not found');
            const foundUser = yield _a._userService.getUserById({
                id: memberId,
            });
            if (!foundUser)
                throw new error_response_1.BadRequestError('User not found');
            const bill = yield _a._billService.createBill({
                method: 'momo',
                date: new Date(Date.now()),
                status: 'pending',
                total: foundSubs.price,
                type: 'memberSubscription',
            });
            const currentDate = new Date(Date.now());
            const endDate = new Date();
            endDate.setDate(currentDate.getDate() + foundSubs.totalDate);
            const subscriptionDetail = yield _a._subscriptionService.findDetailById({
                keySearch: foundSubs.id,
            });
            let memberSubs;
            switch (foundSubs.type) {
                case 'Month': {
                    memberSubs =
                        yield _a._memberSubscriptionRepository.createMemberSubscription({
                            memberId,
                            billId: bill.id,
                            subscriptionId,
                            usesHistory: [],
                            startDate: new Date(Date.now()),
                            endDate,
                        });
                    break;
                }
                case 'Time': {
                    memberSubs =
                        yield _a._memberSubscriptionRepository.createMemberSubscription({
                            memberId,
                            billId: bill.id,
                            subscriptionId,
                            timeRemain: subscriptionDetail === null || subscriptionDetail === void 0 ? void 0 : subscriptionDetail.totalTime,
                            startDate: new Date(Date.now()),
                            endDate,
                        });
                    break;
                }
            }
            const payment = yield _a._paymentService.momoPayment({
                price: foundSubs.price,
                orderId: memberSubs.id,
                returnUrl: '/memberSubscription/momo/PaymentCallBack',
            });
            return payment;
        });
    }
    paymentCallBack(args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orderId, message } = args;
            const foundMemberSubs = yield _a._memberSubscriptionRepository.foundMemberSubscription({
                options: {
                    where: {
                        id: orderId,
                    },
                },
            });
            if (!foundMemberSubs)
                throw new error_response_1.NotFoundError('Member Subscription not found');
            if (message == 'Successful.') {
                // update member subscription status
                const updateMemberSubsOptions = {
                    where: {
                        id: foundMemberSubs.id,
                    },
                    data: {
                        status: 'active',
                    },
                };
                const memberSubs = yield _a._memberSubscriptionRepository.updateMemberSubscription({
                    options: updateMemberSubsOptions,
                });
                // update bill status
                yield _a._billService.updateBill(foundMemberSubs.billId, {
                    status: 'success',
                });
                return memberSubs;
            }
            else {
                const updateMemberSubsOptions = {
                    where: {
                        id: foundMemberSubs.id,
                    },
                    data: {
                        status: 'disable',
                    },
                };
                const memberSubs = yield _a._memberSubscriptionRepository.updateMemberSubscription({
                    options: updateMemberSubsOptions,
                });
                yield _a._billService.updateBill(foundMemberSubs.billId, {
                    status: 'fail',
                });
                throw new Error('fail at payment');
            }
        });
    }
    searchSubscription(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._memberSubscriptionRepository.foundMemberSubscription({
                options: {
                    where: {
                        id,
                    },
                },
            });
        });
    }
    updateMonthSubscription(id, date) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookDate = new Date(date).toISOString().split('T')[0];
            const subscription = yield _a._memberSubscriptionRepository.foundMemberSubscription({
                options: {
                    where: {
                        id,
                    },
                },
            });
            if (!subscription) {
                throw new error_response_1.NotFoundError('Subscription not found');
            }
            if (!subscription.usesHistory.includes(bookDate)) {
                const updatedSubscription = yield _a._memberSubscriptionRepository.updateMemberSubscription({
                    options: {
                        where: { id },
                        data: {
                            usesHistory: {
                                push: bookDate,
                            },
                        },
                    },
                });
                return updatedSubscription;
            }
            else {
                return null;
            }
        });
    }
    updateTimeSubscription(id, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                where: {
                    id,
                },
                data: {
                    timeRemain: {
                        decrement: time,
                    },
                },
            };
            return yield _a._memberSubscriptionRepository.updateMemberSubscription({
                options,
            });
        });
    }
    findMemberSubscriptionBySubId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._memberSubscriptionRepository.findBySubscriptionId(id);
        });
    }
}
exports.MemberSubscriptionService = MemberSubscriptionService;
_a = MemberSubscriptionService;
(() => {
    _a._memberSubscriptionRepository =
        memberSubscription_repository_1.MemberSubscriptionRepository.getInstance();
    _a._billService = bill_service_1.BillService.getInstance();
    _a._paymentService = payment_service_1.PaymentService.getInstance();
    _a._subscriptionService = subscription_service_1.SubscriptionFactory.getInstance();
    _a._userService = user_service_1.UserService.getInstance();
})();
