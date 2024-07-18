// clubId: string;
// startTime: Date;
// endTime: Date;
// dateOfWeek: number;
// price: number;

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../handleResponse/error.response';

export const createSlotValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const slotSchema = Joi.object({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    dateOfWeek: Joi.number().required().min(0),
    price: Joi.number().min(1),
  });

  try {
    await slotSchema.validateAsync(req.body);
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};
