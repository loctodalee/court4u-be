"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transport = nodemailer_1.default.createTransport({
    host: 'email-smtp.ap-southeast-1.amazonaws.com',
    port: 465,
    secure: true,
    auth: {
        user: 'AKIA6ODU6S3SNLDNT6S5',
        pass: 'BL4XQeqyRFwEmmv4/YcOYdWtSM8nL3rkZhmIHqZV/dd4',
    },
});
