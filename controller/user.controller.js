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
exports.UserController = void 0;
const user_service_1 = require("./../service/user.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class UserController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new UserController();
        }
        return this.Instance;
    }
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Get Success',
                metaData: yield UserController.userService.getAll(),
            }).send(res);
        });
    }
    getUserByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Get Success',
                metaData: yield UserController.userService.getUserByEmail(Object.assign({}, req.body)),
            }).send(res);
        });
    }
}
exports.UserController = UserController;
UserController.userService = user_service_1.UserService.getInstance();
