"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessResponse = void 0;
const { StatusCodes, ReasonPhrases } = require('../util/httpStatusCode');
class SuccessResponse {
    constructor({ message, reasonStatusCode = ReasonPhrases.OK, statusCode = StatusCodes.OK, metaData = {}, }) {
        this.message = message;
        this.statusCode = statusCode;
        this.reasonStatusCode = reasonStatusCode;
        this.metaData = metaData;
    }
    send(res) {
        return res.status(this.statusCode).json(this);
    }
}
exports.SuccessResponse = SuccessResponse;
