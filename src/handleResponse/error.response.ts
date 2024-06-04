import { IErrorResponse } from './iError.response';

const { StatusCodes, ReasonPhrases } = require('../util/httpStatusCode');

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

class NotImplementError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.NOT_IMPLEMENTED,
    status: number = StatusCodes.NOT_IMPLEMENTED
  ) {
    super(message, status);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.NOT_FOUND,
    status: number = StatusCodes.NOT_FOUND
  ) {
    super(message, status);
  }
}

class AuthFailure extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    status: number = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}

export {
  AuthFailure,
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  NotImplementError,
  NotFoundError,
};
