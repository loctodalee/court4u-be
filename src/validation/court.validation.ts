import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../handleResponse/error.response';

export const createCourtValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const courtSchema = Joi.object({
    number: Joi.number().required().min(1),
  });
  try {
    await courtSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};
