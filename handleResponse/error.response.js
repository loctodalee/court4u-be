"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.NotFoundError = exports.NotImplementError = exports.BadRequestError = exports.ConflictRequestError = exports.ErrorResponse = exports.AuthFailure = exports.ForbiddenError = void 0;
const { StatusCodes, ReasonPhrases } = require('../util/httpStatusCode');
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.ErrorResponse = ErrorResponse;
class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
        super(message, status);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonPhrases.BAD_REQUEST, status = StatusCodes.BAD_REQUEST) {
        super(message, status);
    }
}
exports.BadRequestError = BadRequestError;
class NotImplementError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_IMPLEMENTED, status = StatusCodes.NOT_IMPLEMENTED) {
        super(message, status);
    }
}
exports.NotImplementError = NotImplementError;
class NotFoundError extends ErrorResponse {
    constructor(message = ReasonPhrases.NOT_FOUND, status = StatusCodes.NOT_FOUND) {
        super(message, status);
    }
}
exports.NotFoundError = NotFoundError;
class AuthFailure extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED, status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}
exports.AuthFailure = AuthFailure;
class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonPhrases.FORBIDDEN, status = StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends ErrorResponse {
    constructor(message = ReasonPhrases.INTERNAL_SERVER_ERROR, status = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}
exports.InternalServerError = InternalServerError;
