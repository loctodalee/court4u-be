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
exports.releaseLock = exports.acquireLock = void 0;
const util_1 = require("util");
const init_redis_1 = require("../lib/init.redis");
const slotOnCourt_service_1 = require("./slotOnCourt.service");
const { instanceConnect: redisClient } = (0, init_redis_1.getRedis)();
if (!redisClient) {
    throw new Error('Redis is not initialize');
}
const pexpire = (0, util_1.promisify)(redisClient.pexpire).bind(redisClient);
const setnxAsync = (0, util_1.promisify)(redisClient.setnx).bind(redisClient);
const delAsyncKey = (0, util_1.promisify)(redisClient.del).bind(redisClient);
const acquireLock = (slotId, date, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const key = `lock__${slotId}`;
    const retryTime = 20; // chỗ này đang bí
    const expiredTime = 3000;
    for (let i = 0; i < retryTime; i++) {
        const result = yield setnxAsync(key, 'lock');
        console.log(`result: ${result}`);
        if (result === 1) {
            const remain = yield slotOnCourt_service_1.SlotOnCourtService.getInstance().getRemainCourt({
                slotId,
                date,
            });
            console.log(`Remaining courts: ${remain}`);
            if (remain >= quantity) {
                yield pexpire(key, expiredTime);
                return key;
            }
            yield delAsyncKey(key);
            return null;
        }
        else {
            yield new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
});
exports.acquireLock = acquireLock;
const releaseLock = (keylock) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield delAsyncKey(keylock);
    return result;
});
exports.releaseLock = releaseLock;
