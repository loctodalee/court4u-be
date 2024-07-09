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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantAccess = void 0;
const error_response_1 = require("../handleResponse/error.response");
const role_middleware_1 = __importDefault(require("./role.middleware"));
const grantAccess = (action, resouce) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log(req.user);
            const rol_name = req.user.roles[0];
            console.log(rol_name);
            const permission = role_middleware_1.default.can(rol_name)[action](resouce);
            if (!permission.granted) {
                throw new error_response_1.AuthFailure('you dont have permission');
            }
            console.log(rol_name);
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.grantAccess = grantAccess;
