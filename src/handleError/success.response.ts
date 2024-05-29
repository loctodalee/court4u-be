import { Response } from "express";

const { StatusCodes, ReasonPhrases } = require("../util/httpStatusCode");

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

  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}

module.exports = {
  SuccessResponse,
};
