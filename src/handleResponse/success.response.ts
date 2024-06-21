import { Response } from 'express';

const { StatusCodes, ReasonPhrases } = require('../util/httpStatusCode');

class SuccessResponse {
  message: string;
  statusCode: number;
  reasonStatusCode: string;
  metaData: Object;

  constructor({
    message,
    reasonStatusCode = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metaData = {},
  }: {
    message: string;
    reasonStatusCode: string;
    statusCode: number;
    metaData: Object;
  }) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metaData = metaData;
  }

  send(res: Response, accessToken: string, refreshToken: string) {
    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(this.statusCode)
      .cookie('accessToken', accessToken, option)
      .cookie('refreshToken', refreshToken, option)
      .json(this);
  }
}
export { SuccessResponse };
