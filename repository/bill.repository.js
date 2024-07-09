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
exports.BillRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BillRepository {
    static getInstance() {
        if (!BillRepository.instance) {
            BillRepository.instance = new BillRepository();
        }
        return BillRepository.instance;
    }
    getBillById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.bill.findUnique({ where: { id } });
        });
    }
    getAllBills() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.bill.findMany();
        });
    }
    createBill(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.bill.create({ data });
        });
    }
    updateBill(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.bill.update({
                where: { id },
                data,
            });
        });
    }
    deleteBill(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.bill.delete({ where: { id } });
        });
    }
}
exports.BillRepository = BillRepository;
