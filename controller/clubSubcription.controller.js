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
exports.ClubSubscriptionController = void 0;
const clubSubscription_service_1 = require("../service/clubSubscription.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class ClubSubscriptionController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new ClubSubscriptionController();
        }
        return this.Instance;
    }
    clubBuySubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Payment redirect',
                metaData: yield ClubSubscriptionController.clubSubscriptionService.buySubscription(Object.assign({ clubId: req.clubId }, req.body)),
            }).send(res);
        });
    }
    paymentCallBack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Buy subscription',
                metaData: yield ClubSubscriptionController.clubSubscriptionService.paymentCallBack(Object.assign({}, req.query)),
            }).send(res);
        });
    }
    findClubSubsByClubId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Find club subscription',
                metaData: yield ClubSubscriptionController.clubSubscriptionService.findClubSubsByClubId(req.clubId),
            }).send(res);
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Find club subscription',
                metaData: yield ClubSubscriptionController.clubSubscriptionService.getAll(),
            }).send(res);
        });
    }
}
exports.ClubSubscriptionController = ClubSubscriptionController;
ClubSubscriptionController.clubSubscriptionService = clubSubscription_service_1.ClubSubscriptionService.getInstance();
