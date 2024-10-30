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

export const createClubFirstTime = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // fullname: string;
  // email: string;
  // phone: string;
  // clubName: string;
  // address: string;
  // district: string;
  // cityOfProvince: string;
  // description: string;
  // logoUrl: string | null;
  // preOrder: number;
  // clubId: string;
  // subscriptionForClubId: string;
  const createClubSchema = Joi.object({
    fullname: Joi.string().min(3).required(),
    email: Joi.string().min(3).required(),
    phone: Joi.string().min(9).required(),
    clubName: Joi.string().min(3).required(),
    address: Joi.string().min(3).required(),
    district: Joi.string().min(3).required(),
    cityOfProvince: Joi.string().min(1).required(),
    description: Joi.string().min(3).required(),
    logoUrl: Joi.string().min(3),
    preOrder: Joi.number().min(1).max(100).required(),
    subscriptionForClubId: Joi.string().min(3).required(),
  });
  try {
    await createClubSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error: any) {
    throw new BadRequestError(error);
  }
};
