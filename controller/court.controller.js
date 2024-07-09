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
exports.CourtController = void 0;
const court_service_1 = require("../service/court.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class CourtController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new CourtController();
        }
        return this.Instance;
    }
    /**
     * @description Tạo court mới
     * @param req {clubId,status?,number}
     * @param res {court}
     */
    createCourt(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Create new court',
                metaData: yield CourtController.courtService.createCourt(Object.assign({ clubId: req.clubId }, req.body)),
            }).send(res);
        });
    }
    getAllCourtByClubId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get  new court',
                metaData: yield CourtController.courtService.getAllCourtByClubId(req.clubId),
            }).send(res);
        });
    }
}
exports.CourtController = CourtController;
CourtController.courtService = court_service_1.CourtService.getInstance();
