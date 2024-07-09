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
exports.MemberSubscriptionController = void 0;
const memberSubscription_service_1 = require("../service/memberSubscription.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class MemberSubscriptionController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new MemberSubscriptionController();
        }
        return this.Instance;
    }
    buyMemberSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Direct Payment',
                metaData: yield MemberSubscriptionController.memberSubscriptionService.buySubscription(Object.assign({ memberId: req.user.userId }, req.body)),
            }).send(res);
        });
    }
    paymentCallBack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Direct Payment',
                metaData: yield MemberSubscriptionController.memberSubscriptionService.paymentCallBack(Object.assign({}, req.query)),
            }).send(res);
        });
    }
    findBySubscriptionId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Find membersubscription',
                metaData: yield MemberSubscriptionController.memberSubscriptionService.findMemberSubscriptionBySubId(req.params.id),
            }).send(res);
        });
    }
}
exports.MemberSubscriptionController = MemberSubscriptionController;
MemberSubscriptionController.memberSubscriptionService = memberSubscription_service_1.MemberSubscriptionService.getInstance();
