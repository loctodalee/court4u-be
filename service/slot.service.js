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
exports.SlotService = void 0;
const slot_repository_1 = require("../repository/slot.repository");
const club_service_1 = require("./club.service");
const error_response_1 = require("../handleResponse/error.response");
const slotOnCourt_service_1 = require("./slotOnCourt.service");
const timeFormat_1 = require("../util/timeFormat");
class SlotService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    addSlot(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, startTime, endTime, dateOfWeek, price, }) {
            const foundClub = yield _a._clubService.foundClubById({ clubId });
            if (!foundClub)
                throw new error_response_1.NotFoundError('Club not found');
            if (startTime > endTime)
                throw new error_response_1.NotImplementError('Start time or end time wrong');
            var result = yield _a._slotRepository.addSlot({
                clubId,
                startTime,
                endTime,
                dateOfWeek,
                price,
            });
            return result;
        });
    }
    getSlotByClubId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._slotRepository.findManySlot({
                options: {
                    where: {
                        clubId: id,
                    },
                },
            });
        });
    }
    findClubInfo(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId }) {
            var club = yield _a._clubService.foundClubById({
                clubId,
            });
            if (!club)
                throw new error_response_1.BadRequestError('Club not found!');
            var slot = yield _a._slotRepository.findManySlot({
                options: {
                    where: {
                        clubId: club.id,
                    },
                },
            });
            return {
                club,
                slot,
            };
        });
    }
    getSlotInfoByClubIdAndDate(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, startDate, endDate, }) {
            var club = yield _a._clubService.foundClubById({ clubId });
            if (!club)
                throw new error_response_1.BadRequestError('Club not found');
            var slots = yield _a._slotRepository.findManySlot({
                options: {
                    where: {
                        clubId,
                    },
                },
            });
            if (!slots)
                throw new error_response_1.BadRequestError('Slot not found');
            var start = (0, timeFormat_1.toMidnight)(startDate);
            var end = (0, timeFormat_1.toMidnight)(endDate);
            var listSlotInfo = [];
            for (let i = start; i <= end; i.setDate(i.getDate() + 1)) {
                console.log(i);
                slots.forEach((x) => {
                    listSlotInfo.push(Object.assign(Object.assign({}, x), { 
                        // courtRemain: await SlotService._slotOnCourtService.getRemainCourt({
                        //   slotId: x.id,
                        //   date: i,
                        // }),
                        courtRemain: 1, date: new Date(i.getFullYear(), i.getMonth(), i.getDate()) }));
                });
            }
            yield Promise.all(listSlotInfo.map((slotInfo) => __awaiter(this, void 0, void 0, function* () {
                slotInfo.courtRemain =
                    yield _a._slotOnCourtService.getRemainCourt({
                        slotId: slotInfo.id,
                        date: slotInfo.date,
                    });
            })));
            console.log(listSlotInfo);
            return listSlotInfo;
        });
    }
    getClubWithDateTime(date, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const slots = yield _a._slotRepository.findManySlot({
                options: {},
            });
            const remainSlotList = [];
            yield Promise.all(slots.map((x) => __awaiter(this, void 0, void 0, function* () {
                const remain = yield _a._slotOnCourtService.getRemainCourt({
                    slotId: x.id,
                    date,
                });
                if (remain != 0) {
                    remainSlotList.push(Object.assign(Object.assign({}, x), { remain: remain }));
                }
            })));
            console.log(remainSlotList);
            return remainSlotList;
        });
    }
}
exports.SlotService = SlotService;
_a = SlotService;
(() => {
    _a._slotOnCourtService = slotOnCourt_service_1.SlotOnCourtService.getInstance();
    _a._clubService = club_service_1.ClubService.getInstance();
    _a._slotRepository = slot_repository_1.SlotRepository.getInstance();
})();
