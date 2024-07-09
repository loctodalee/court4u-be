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
exports.SubscriptionForClubController = void 0;
const subscriptionForClub_service_1 = require("../service/subscriptionForClub.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class SubscriptionForClubController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new SubscriptionForClubController();
        }
        return this.Instance;
    }
    getAllSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Get all subscriptions for clubs',
                metaData: yield SubscriptionForClubController.subscriptionForClubService.getAllSubscription(),
            }).send(res);
        });
    }
    createSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Create subscription for clubs',
                metaData: yield SubscriptionForClubController.subscriptionForClubService.createSubscription(Object.assign({}, req.body)),
            }).send(res);
        });
    }
}
exports.SubscriptionForClubController = SubscriptionForClubController;
SubscriptionForClubController.subscriptionForClubService = subscriptionForClub_service_1.SubscriptionForClubService.getInstance();
