import { Request, Response, NextFunction } from 'express';
import Joi, { func } from 'joi';
import { BadRequestError } from '../handleResponse/error.response';
export async function loginValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const loginSchema = Joi.object({
    email: Joi.string().required().min(3),
    password: Joi.string().required().min(3),
  });

  try {
    await loginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    throw new BadRequestError(err);
  }
}

export async function signUpNewUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const signUpSchema = Joi.object({
    email: Joi.string()
      .required()
      .regex(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      .min(3),
    fullname: Joi.string().required().min(1),
    password: Joi.string().required().min(3),
    phone: Joi.number().required().min(3),
  });

  try {
    await signUpSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (err: any) {
    throw new BadRequestError(err);
  }
}
