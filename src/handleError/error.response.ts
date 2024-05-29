import { IErrorResponse } from "./iError.response";

const { StatusCodes, ReasonPhrases } = require("../util/httpStatusCode");

class ErrorResponse extends Error implements IErrorResponse {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.CONFLICT,
    status: number = StatusCodes.CONFLICT
  ) {
    super(message, status);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.BAD_REQUEST,
    status: number = StatusCodes.BAD_REQUEST
  ) {
    super(message, status);
  }
}

module.exports = {
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
};
