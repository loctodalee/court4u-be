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
exports.SubscriptionFactory = void 0;
const error_response_1 = require("../handleResponse/error.response");
const subscription_repository_1 = require("../repository/subscription.repository");
const payment_service_1 = require("./payment.service");
class SubscriptionFactory {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SubscriptionFactory();
        }
        return this.Instance;
    }
    constructor() { }
    registerSubscriptionType(type, classRef) {
        SubscriptionFactory.subsRegistry[type] = classRef;
    }
    createSubscription(type, payload) {
        const subscriptionClass = SubscriptionFactory.subsRegistry[type];
        if (!subscriptionClass)
            throw new error_response_1.BadRequestError('Subscription not found');
        return new subscriptionClass(payload).createSubscription();
    }
    updateSubscription(_a) {
        return __awaiter(this, arguments, void 0, function* ({ type, subscriptionId, payload, }) {
            const subscriptionClass = SubscriptionFactory.subsRegistry[type];
            if (!subscriptionClass)
                throw new error_response_1.BadRequestError('Subscription not found');
            return new subscriptionClass(payload).updateSubscription({
                subscriptionId,
            });
        });
    }
    searchSubscriptionByClubId(_a) {
        return __awaiter(this, arguments, void 0, function* ({ keySearch, }) {
            const options = {
                where: {
                    clubId: keySearch,
                },
            };
            return yield SubscriptionFactory._subscriptionRepository.searchSubscriptions({ options });
        });
    }
    findSubscriptionById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ keySearch, }) {
            const options = {
                where: {
                    id: keySearch,
                },
            };
            return yield SubscriptionFactory._subscriptionRepository.findSubscriptionOption({
                options,
            });
        });
    }
    findDetailById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ keySearch, }) {
            return yield SubscriptionFactory._subscriptionRepository.findSubscriptionDetail({
                options: {
                    where: {
                        id: keySearch,
                    },
                },
            });
        });
    }
}
exports.SubscriptionFactory = SubscriptionFactory;
SubscriptionFactory._subscriptionRepository = subscription_repository_1.SubscriptionRepository.getInstance();
SubscriptionFactory.subsRegistry = {};
class Subscription {
    constructor({ clubId, name, price, totalDate, type, status = 'disable', detail, }) {
        this.clubId = clubId;
        this.name = name;
        this.price = price;
        this.totalDate = totalDate;
        this.status = status;
        this.type = type;
        this._subscriptionRepository = subscription_repository_1.SubscriptionRepository.getInstance();
        this._paymentService = new payment_service_1.PaymentService();
        this.detail = detail;
    }
    createSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newSubscription = yield this._subscriptionRepository.createSubscription({
                id: subscriptionId,
                clubId: this.clubId,
                name: this.name,
                totalDate: this.totalDate,
                price: this.price,
                status: this.status,
                type: this.type,
            });
            return newSubscription;
        });
    }
}
class SubscriptionOptionMonth extends Subscription {
    createSubscription() {
        const _super = Object.create(null, {
            createSubscription: { get: () => super.createSubscription }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                where: {
                    clubId: this.clubId,
                },
            };
            const newSubsOptionMonth = yield this._subscriptionRepository.createSubscriptionMonth(Object.assign({ clubId: this.clubId }, this.detail));
            if (!newSubsOptionMonth)
                throw new error_response_1.BadRequestError('Fail to create detail');
            const newSubscription = yield _super.createSubscription.call(this, newSubsOptionMonth.id);
            return {
                newSubscription,
            };
        });
    }
}
class SubscriptionOptionTime extends Subscription {
    createSubscription() {
        const _super = Object.create(null, {
            createSubscription: { get: () => super.createSubscription }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                where: {
                    clubId: this.clubId,
                },
            };
            const newSubsOptionTime = yield this._subscriptionRepository.createSubscriptionTime(Object.assign({ clubId: this.clubId }, this.detail));
            if (!newSubsOptionTime)
                throw new error_response_1.NotImplementError('Club already buy this subscription');
            const newSubscription = yield _super.createSubscription.call(this, newSubsOptionTime.id);
            return {
                newSubscription,
            };
        });
    }
}
const factory = new SubscriptionFactory();
factory.registerSubscriptionType('Month', SubscriptionOptionMonth);
factory.registerSubscriptionType('Time', SubscriptionOptionTime);
