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
exports.ClubController = void 0;
const club_service_1 = require("../service/club.service");
const slot_service_1 = require("../service/slot.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class ClubController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new ClubController();
        }
        return this.Instance;
    }
    /**
     * @description tạo 1 club mới
     * @param req {name, address, district, cityOfProvince, logoUrl?, description?}
     * @param res {club}
     */
    createClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const courtOwnerId = req.user.userId;
            new SuccessResponse({
                message: 'create club success',
                metaData: yield ClubController.clubService.addClub(Object.assign({ courtOwnerId }, req.body)),
            }).send(res);
        });
    }
    findClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'create club success',
                metaData: yield ClubController.slotService.findClubInfo({
                    clubId: req.params.clubId,
                }),
            }).send(res);
        });
    }
    getClubs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get club success',
                metaData: yield ClubController.clubService.getClubs(),
            }).send(res);
        });
    }
    updateClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubId = req.clubId;
            new SuccessResponse({
                message: 'update club success',
                metaData: yield ClubController.clubService.updateClub(clubId, Object.assign({}, req.body)),
            }).send(res);
        });
    }
    deleteClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const clubId = req.clubId;
            new SuccessResponse({
                message: 'delete club success',
                metaData: yield ClubController.clubService.deleteClub({ id: clubId }),
            }).send(res);
        });
    }
    getSlotInfoByClubIdAndDate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get club and slot success',
                metaData: yield ClubController.slotService.getSlotInfoByClubIdAndDate({
                    clubId: req.params.clubId,
                    startDate: new Date(req.query.startDate),
                    endDate: new Date(req.query.endDate),
                }),
            }).send(res);
        });
    }
    searchClub(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get club and slot success',
                metaData: yield ClubController.clubService.searchByLocation(Object.assign({}, req.query)),
            }).send(res);
        });
    }
}
exports.ClubController = ClubController;
ClubController.clubService = club_service_1.ClubService.getInstance();
ClubController.slotService = slot_service_1.SlotService.getInstance();
