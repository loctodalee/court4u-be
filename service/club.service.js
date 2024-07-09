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
exports.ClubService = void 0;
const club_repository_1 = require("../repository/club.repository");
const user_service_1 = require("./user.service");
const error_response_1 = require("../handleResponse/error.response");
class ClubService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    searchByLocation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._clubRepository.searchClub(data);
        });
    }
    addClub(_b) {
        return __awaiter(this, arguments, void 0, function* ({ courtOwnerId, name, address, district, cityOfProvince, logoUrl = null, description = '', preOrder, }) {
            const newClub = yield _a._clubRepository.addClub({
                name,
                address,
                cityOfProvince,
                courtOwnerId,
                description,
                district,
                logoUrl,
                preOrder,
            });
            yield _a._userService.updateApiKey({
                apiKey: newClub.apiKey,
                userId: courtOwnerId,
            });
            return newClub;
        });
    }
    foundClubById(_b) {
        return __awaiter(this, arguments, void 0, function* ({ clubId, }) {
            return _a._clubRepository.foundClub({
                options: {
                    where: {
                        id: clubId,
                    },
                },
            });
        });
    }
    getClubs() {
        return __awaiter(this, void 0, void 0, function* () {
            var clubs = yield _a._clubRepository.getClubs();
            if (!clubs) {
                throw new error_response_1.BadRequestError();
            }
            return clubs;
        });
    }
    updateClub(clubId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield _a._clubRepository.updateClub(clubId, data);
            return result;
        });
    }
    deleteClub(_b) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            var result = yield _a._clubRepository.deleteClub({ id });
            return result;
        });
    }
}
exports.ClubService = ClubService;
_a = ClubService;
(() => {
    _a._userService = user_service_1.UserService.getInstance();
    _a._clubRepository = club_repository_1.ClubRepository.getInstance();
})();
