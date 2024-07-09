"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailjet = void 0;
const node_mailjet_1 = __importDefault(require("node-mailjet"));
exports.mailjet = new node_mailjet_1.default({
    apiKey: process.env.MJ_APIKEY_PUBLIC || 'your-api-key',
    apiSecret: process.env.MJ_APIKEY_PRIVATE || 'your-api-secret',
});
