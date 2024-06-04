import Jwt from 'jsonwebtoken';
import { asyncHandler } from '../helper/asyncHandler';
import { NextFunction, Request, Response } from 'express';
import { AuthFailure } from '../handleResponse/error.response';
import { IKeyTokenService } from '../service/iKeyToken.service';
import { KeyTokenService } from '../service/keyToken.service';
export const createTokenPair = async ({
  payload,
  publicKey,
  privateKey,
}: {
  payload: any;
  publicKey: string;
  privateKey: string;
}): Promise<any> => {
  try {
    const accsessToken = await Jwt.sign(payload, publicKey, {
      expiresIn: '1 days',
    });

    const refreshToken = await Jwt.sign(payload, privateKey, {
      expiresIn: '3 days',
    });

    return { accsessToken, refreshToken };
  } catch (error) {}
};

export const authentication = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers['client-id'];
    if (!userId) throw new AuthFailure('Not found client id');
    const _keyTokenService: IKeyTokenService = new KeyTokenService();
  }
);
