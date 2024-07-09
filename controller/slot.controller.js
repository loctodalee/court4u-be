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
exports.SlotController = void 0;
const slot_service_1 = require("../service/slot.service");
const slotOnCourt_service_1 = require("../service/slotOnCourt.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class SlotController {
    static getInstacnce() {
        if (!this.Instance) {
            this.Instance = new SlotController();
        }
        return this.Instance;
    }
    /**
     * @description tạo slot mới
     * @param req {clubId, startTime, endTime, dateOfWeek}
     * @param res {slot}
     */
    addSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'create new slot',
                metaData: yield SlotController.slotService.addSlot(Object.assign({ clubId: req.clubId }, req.body)),
            }).send(res);
        });
    }
    /**
     * @description Thêm sân vào slot
     * @param req {slotId, courtId, status?}
     * @param res {slotOnCourt}
     */
    addCourtOnSlot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Add slot to court',
                metaData: yield SlotController.slotOnCourtService.addCourtOnSlot(Object.assign({ slotId: req.params.id }, req.body)),
            }).send(res);
        });
    }
    getAllCourtsBySlotId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get court by slot id',
                metaData: yield SlotController.slotOnCourtService.getAllCourtBySlotId(req.params.id),
            }).send(res);
        });
    }
    getRemainCourt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get court remain court',
                metaData: yield SlotController.slotOnCourtService.getRemainCourt(Object.assign({}, req.body)),
            }).send(res);
        });
    }
    getClubWithDateTime(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get court remain court',
                metaData: yield SlotController.slotService.getClubWithDateTime(new Date(req.query.date), new Date(req.query.time)),
            }).send(res);
        });
    }
}
exports.SlotController = SlotController;
SlotController.slotService = slot_service_1.SlotService.getInstance();
SlotController.slotOnCourtService = slotOnCourt_service_1.SlotOnCourtService.getInstance();
