// fullname: string;
// email: string;
// phone: string;
// clubId: string;

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../handleResponse/error.response';

export const createStaffProfileValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const staffProfleSchema = Joi.object({
    fullname: Joi.string().min(3).required(),
    email: Joi.string().min(5).required(),
    phone: Joi.string().min(9).required(),
  });

  try {
    await staffProfleSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};
