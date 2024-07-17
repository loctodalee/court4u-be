import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { BadRequestError } from '../handleResponse/error.response';

export const createClubValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clubSchema = Joi.object({
    name: Joi.string().required().min(3),
    address: Joi.string().required().min(3),
    district: Joi.string().required().min(3),
    cityOfProvince: Joi.string().required().min(3),
    logoUrl: Joi.string().min(3),
    description: Joi.string().required().min(3),
    preOrder: Joi.number().required().min(1),
  });

  try {
    await clubSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};

export const updateClubValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clubSchema = Joi.object({
    name: Joi.string().min(3),
    address: Joi.string().min(3),
    district: Joi.string().min(3),
    cityOfProvince: Joi.string().min(3),
    logoUrl: Joi.string().min(3),
    description: Joi.string().min(3),
    preOrder: Joi.number().min(1),
  });

  try {
    await clubSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};
