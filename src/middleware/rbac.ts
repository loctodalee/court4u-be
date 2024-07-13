import { NextFunction, Request, Response } from 'express';
import { AuthFailure } from '../handleResponse/error.response';
import ac from './role.middleware';

const grantAccess = (
  action:
    | 'readAny'
    | 'readOwn'
    | 'createAny'
    | 'createOwn'
    | 'updateAny'
    | 'updateOwn'
    | 'deleteAny'
    | 'deleteOwn',
  resouce: string
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rol_name = req.user.roles[0] as string;
      const permission = ac.can(rol_name)[action](resouce);
      if (!permission.granted) {
        throw new AuthFailure('you dont have permission');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export { grantAccess };
