// clubId: string;
// userId: string;
// content: string;
// parentId: string | null;

import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../handleResponse/error.response';

export const createReviewValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const reviewSchema = Joi.object({
    clubId: Joi.string().min(3).required(),
    content: Joi.string().min(3).required(),
    parentId: Joi.string().min(3),
  });

  try {
    await reviewSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};
