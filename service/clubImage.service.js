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
exports.ClubImageService = void 0;
const clubImage_repository_1 = require("../repository/clubImage.repository");
class ClubImageService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    getClubImageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return _a.clubImageRepository.getClubImageById(id);
        });
    }
    getAllClubImages() {
        return __awaiter(this, void 0, void 0, function* () {
            return _a.clubImageRepository.getAllClubImages();
        });
    }
    createClubImage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return _a.clubImageRepository.createClubImage(data);
        });
    }
    updateClubImage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return _a.clubImageRepository.updateClubImage(id, data);
        });
    }
    deleteClubImage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return _a.clubImageRepository.deleteClubImage(id);
        });
    }
}
exports.ClubImageService = ClubImageService;
_a = ClubImageService;
(() => {
    _a.clubImageRepository = clubImage_repository_1.ClubImageRepository.getInstance();
})();
