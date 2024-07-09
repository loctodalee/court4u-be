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
exports.RoleService = void 0;
const role_repository_1 = require("../repository/role.repository");
const error_response_1 = require("../handleResponse/error.response");
const userRole_repository_1 = require("../repository/userRole.repository");
class RoleService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new _a();
        }
        return this.Instance;
    }
    addRole(_b) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            try {
                return _a._roleRepository.addRole(name);
            }
            catch (error) {
                throw new error_response_1.BadRequestError(error.message);
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield _a._roleRepository.findById(id);
            if (!result)
                throw new error_response_1.NotFoundError(`Not found role with id: ${id}`);
            return result;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield _a._roleRepository.findByName(name);
            if (!result)
                throw new error_response_1.NotFoundError(`Not found role with id: ${name}`);
            return result;
        });
    }
    deleteRole(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield _a._roleRepository.deleteRole(id);
            }
            catch (error) {
                throw new error_response_1.BadRequestError(error.message);
            }
        });
    }
    getAllRole() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield _a._roleRepository.getAll();
            }
            catch (error) {
                throw new error_response_1.BadRequestError(error.message);
            }
        });
    }
    assignRoleToUser(_b) {
        return __awaiter(this, arguments, void 0, function* ({ userId, roleId, }) {
            try {
                return yield _a._userRoleRepository.addUserRole({
                    userId,
                    roleId,
                });
            }
            catch (error) {
                throw new error_response_1.BadRequestError(error);
            }
        });
    }
    getAllUserRole() {
        return __awaiter(this, void 0, void 0, function* () {
            return _a._userRoleRepository.findUserRole();
        });
    }
    findUserRole(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var result = yield _a._userRoleRepository.findUserRole(data);
            if (!result)
                throw new error_response_1.NotFoundError('Not found user role');
            return result;
        });
    }
    findRoleName(listRole) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield _a._roleRepository.getListRoleById(listRole);
        });
    }
}
exports.RoleService = RoleService;
_a = RoleService;
(() => {
    _a._roleRepository = role_repository_1.RoleRepository.getInstance();
    _a._userRoleRepository = userRole_repository_1.UserRoleRepository.getInstance();
})();
