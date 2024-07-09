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
exports.closeRedis = exports.getRedis = exports.initRedis = void 0;
const { InternalServerError } = require('../handleResponse/error.response');
const { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_URL } = process.env;
const redis_1 = require("redis");
let client = {};
// Define connection status constants
const statusConnectRedis = {
    READY: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
};
// Variable to store the connection timeout
let connectionTimeout;
const REDIS_CONNECT_TIMEOUT = 10 * 1000;
const REDIS_CONNECT_MESSAGE = {
    code: -99,
    message: 'Error at init redis',
};
const handleTimeoutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new InternalServerError({
            message: REDIS_CONNECT_MESSAGE.message,
            statusCode: REDIS_CONNECT_MESSAGE.code,
        });
    }, REDIS_CONNECT_TIMEOUT);
};
const handleEventConnect = (connectionRedis) => {
    connectionRedis.on(statusConnectRedis.READY, () => {
        console.log('connection redis - connection status: connected');
        if (connectionTimeout)
            clearTimeout(connectionTimeout);
    });
    connectionRedis.on(statusConnectRedis.END, () => {
        console.log('connection redis - connection status: disconnected');
        handleTimeoutError();
    });
    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log('connection redis - connection status: reconnecting');
        if (connectionTimeout)
            clearTimeout(connectionTimeout);
    });
    connectionRedis.on(statusConnectRedis.ERROR, (error) => {
        console.log(`connection redis - connection status: error: ${error}`);
        handleTimeoutError();
    });
};
const initRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const instanceRedis = (0, redis_1.createClient)({
            url: REDIS_URL,
        });
        handleEventConnect(instanceRedis);
        client.instanceConnect = instanceRedis;
        console.log('Redis client initialized successfully');
    }
    catch (error) {
        console.error(`Failed to connect to Redis: ${error.message}`);
        handleTimeoutError();
    }
});
exports.initRedis = initRedis;
const getRedis = () => {
    return client;
};
exports.getRedis = getRedis;
const closeRedis = () => { };
exports.closeRedis = closeRedis;
