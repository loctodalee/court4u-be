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
exports.BillController = void 0;
const { SuccessResponse } = require('../handleResponse/success.response');
const bill_service_1 = require("../service/bill.service");
class BillController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new BillController();
        }
        return this.Instance;
    }
    getAllBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get bill success',
                metaData: yield BillController._billService.getAllBills(),
            }).send(res);
        });
    }
    getBillById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get bill success',
                metaData: yield BillController._billService.getBillById(req.params.id),
            }).send(res);
        });
    }
}
exports.BillController = BillController;
BillController._billService = bill_service_1.BillService.getInstance();
