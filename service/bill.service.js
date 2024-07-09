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
exports.BillService = void 0;
const bill_repository_1 = require("../repository/bill.repository");
class BillService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new BillService();
        }
        return this.Instance;
    }
    constructor() { }
    getBillById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return BillService.billRepository.getBillById(id);
        });
    }
    getAllBills() {
        return __awaiter(this, void 0, void 0, function* () {
            return BillService.billRepository.getAllBills();
        });
    }
    createBill(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return BillService.billRepository.createBill(data);
        });
    }
    updateBill(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return BillService.billRepository.updateBill(id, data);
        });
    }
    deleteBill(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return BillService.billRepository.deleteBill(id);
        });
    }
}
exports.BillService = BillService;
BillService.billRepository = bill_repository_1.BillRepository.getInstance();
