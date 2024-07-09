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
exports.PaymentController = void 0;
const payment_service_1 = require("../service/payment.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class PaymentController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new PaymentController();
        }
        return this.Instance;
    }
    MomoPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var paymentService = new payment_service_1.PaymentService();
            new SuccessResponse({
                message: 'Direct to momo payment',
                metaData: yield paymentService.momoPayment({
                    price: 1200,
                    orderId: 'testtesttest123123123',
                    returnUrl: '',
                }),
            }).send(res);
        });
    }
    MomoCallBack(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json(req.query);
            console.log(req.query);
        });
    }
}
exports.PaymentController = PaymentController;
