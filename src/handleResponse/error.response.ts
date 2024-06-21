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

class ForbiddenError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    status: number = StatusCodes.FORBIDDEN
  ) {
    super(message, status);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
    status: number = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message, status);
  }
}
export {
  ForbiddenError,
  AuthFailure,
  ErrorResponse,
  ConflictRequestError,
  BadRequestError,
  NotImplementError,
  NotFoundError,
  InternalServerError,
};
