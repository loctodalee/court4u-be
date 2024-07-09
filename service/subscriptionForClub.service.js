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
exports.SubscriptionForClubService = void 0;
const subscriptionForClub_repository_1 = require("../repository/subscriptionForClub.repository");
const error_response_1 = require("../handleResponse/error.response");
class SubscriptionForClubService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._subscriptionForClubRepo.createNewSubscription(data);
        });
    }
    searchById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._subscriptionForClubRepo.searchById(id);
        });
    }
    getAllSubscription() {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield _a._subscriptionForClubRepo.getAll();
            if (!result)
                throw new error_response_1.BadRequestError('No subscription found!');
            return result;
        });
    }
}
exports.SubscriptionForClubService = SubscriptionForClubService;
_a = SubscriptionForClubService;
(() => {
    _a._subscriptionForClubRepo = subscriptionForClub_repository_1.SubscriptionForClubRepository.getInstance();
})();
