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
exports.RoleController = void 0;
const role_service_1 = require("../service/role.service");
const { SuccessResponse } = require('../handleResponse/success.response');
class RoleController {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new RoleController();
        }
        return this.Instance;
    }
    addRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'create new role success',
                metaData: yield RoleController._roleSerivce.addRole(Object.assign({}, req.body)),
            }).send(res);
        });
    }
    findRoleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get role success',
                metaData: yield RoleController._roleSerivce.findById(req.params.id),
            }).send(res);
        });
    }
    findByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'get role success',
                metaData: yield RoleController._roleSerivce.findByName(req.params.name),
            });
        });
    }
    deleteRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Remove role success',
                metaData: yield RoleController._roleSerivce.deleteRole(req.params.id),
            }).send(res);
        });
    }
    getAllRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Remove role success',
                metaData: yield RoleController._roleSerivce.getAllRole(),
            }).send(res);
        });
    }
    assignRoleToUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'Assign role to user success',
                metaData: yield RoleController._roleSerivce.assignRoleToUser(Object.assign({}, req.body)),
            }).send(res);
        });
    }
    getAllUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            new SuccessResponse({
                message: 'find role to user success',
                metaData: yield RoleController._roleSerivce.getAllUserRole(),
            }).send(res);
        });
    }
    findUserRole(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { userId: req.params.userId, roleId: req.params.roleId };
            new SuccessResponse({
                message: 'find role to user success',
                metaData: yield RoleController._roleSerivce.findUserRole(data),
            }).send(res);
        });
    }
}
exports.RoleController = RoleController;
RoleController._roleSerivce = role_service_1.RoleService.getInstance();
