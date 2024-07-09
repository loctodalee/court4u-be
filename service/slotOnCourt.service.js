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
exports.SlotOnCourtService = void 0;
const slotOnCourt_repository_1 = require("../repository/slotOnCourt.repository");
const error_response_1 = require("../handleResponse/error.response");
const bookedSlot_service_1 = require("./bookedSlot.service");
const timeFormat_1 = require("../util/timeFormat");
class SlotOnCourtService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    addCourtOnSlot(_b) {
        return __awaiter(this, arguments, void 0, function* ({ status, slotId, courtId, }) {
            try {
                var foundSlotOnCourt = yield _a._slotOnCourtRepository.findUniqueSlotOnCourt({
                    slotId,
                    courtId,
                });
                if (foundSlotOnCourt)
                    throw new error_response_1.BadRequestError(`Court with id ${courtId} have been add to this slot`);
                var result = yield _a._slotOnCourtRepository.addCourtOnSlot({
                    status: 'available',
                    slotId,
                    courtId,
                });
                return result;
            }
            catch (error) {
                throw new error_response_1.BadRequestError(error);
            }
        });
    }
    searchSlotOnCourt(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._slotOnCourtRepository.searchSlotOnCourt(id);
        });
    }
    getAllCourtBySlotId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._slotOnCourtRepository.getAllCourtBySlotId(id);
        });
    }
    getRemainCourt(_b) {
        return __awaiter(this, arguments, void 0, function* ({ slotId, date, }) {
            var numbCourt = yield _a._slotOnCourtRepository.getAllCourtBySlotId(slotId);
            var bookedSlot = yield _a._bookedSlotService.getBookedSlotWithDateAndSlotId({ slotId, date: (0, timeFormat_1.toMidnight)(date) });
            var remainCourt = numbCourt.length - bookedSlot.length;
            return remainCourt;
        });
    }
}
exports.SlotOnCourtService = SlotOnCourtService;
_a = SlotOnCourtService;
(() => {
    _a._slotOnCourtRepository = slotOnCourt_repository_1.SlotOnCourtRepository.getInstance();
    _a._bookedSlotService = bookedSlot_service_1.BookedSlotService.getInstance();
})();
