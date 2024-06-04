import { createTokenPair } from '../auth/authUtils';
import {
  AuthFailure,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  NotImplementError,
} from '../handleResponse/error.response';
import { IUserRepository } from '../repository/iUser.repository';
import { UserRepository } from '../repository/user.repository';
import { IAuthService } from './iAuth.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IKeyTokenService } from './iKeyToken.service';
import { KeyTokenService } from './keyToken.service';
import { filterData } from '../util/filterData';
import { IEmailService } from './iEmail.service';
import { EmailService } from './email.service';
import prisma from '../lib/prisma';
import passport from '../lib/init.googleOAuth';
import { keyTokens, users } from '@prisma/client';
export class AuthService implements IAuthService {
  private readonly _userRepository: IUserRepository;
  private readonly _keyTokenService: IKeyTokenService;
  private _emailService: IEmailService;

  constructor() {
    this._keyTokenService = new KeyTokenService();
    this._userRepository = UserRepository.getInstance();
    this._emailService = new EmailService();
  }
  //create public key and private key
  createKeys = () => {
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');
    return { publicKey, privateKey };
  };
  //login
  public async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    const foundUser = await this._userRepository.getUserByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError('Login fail');
    }
    if (foundUser.password == null) throw new BadRequestError('Login fail');
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      throw new BadRequestError('Login fail');
    }

    //create public key for accessToken, private key for refreshToken
    const keys = this.createKeys();

    //create accessToken and RefreshToken
    const tokens = await createTokenPair({
      payload: {
        userId: foundUser.id,
        email: foundUser.email,
      },
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    });

    await this._keyTokenService.createOrUpdateKeyToken({
      userId: foundUser.id,
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: filterData({
        fields: ['id', 'username', 'phone', 'avatarUrl', 'email'],
        object: foundUser,
      }),
      tokens,
    };
  }
  //end login

  // ---------new customer
  public async newUser({
    username,
    password,
    phone,
    email,
  }: {
    username: string;
    password: string;
    phone: string;
    email: string;
  }): Promise<any> {
    const user = await UserRepository.getInstance().getUserByEmail({ email });
    if (user) {
      throw new NotImplementError('Email already existed');
    }

    // send mail
    const result = await this._emailService.sendEmailToken({ email });
    console.log(result);
    // create user with status = false
    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        username,
        password: hashPassword,
        email,
        phone,
        status: 'disable',
        otp: result.toString(),
      },
    });

    return {
      message: 'Verify email user',
    };
  }

  //---------- check email token
  public async checkLoginEmailToken({ token }: { token: any }): Promise<any> {
    console.log('Check login email token');
    // search and update status, set otp user to null
    const foundUser = await prisma.users.update({
      where: {
        otp: token,
      },
      data: {
        status: 'active',
        otp: null,
      },
    });

    if (!foundUser) throw new NotFoundError('Token not found');
    const keys = this.createKeys();
    const tokens = await createTokenPair({
      payload: {
        userId: foundUser.id,
        email: foundUser.email,
      },
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    });

    await this._keyTokenService.createOrUpdateKeyToken({
      userId: foundUser.id,
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      refreshToken: tokens.refreshToken,
    });
    const resUser = filterData({
      fields: ['id', 'username', 'phone', 'avatarUrl', 'email'],
      object: foundUser,
    });

    return {
      user: resUser,
      tokens: tokens,
    };
  }

  //--------login with third party
  public async loginWithThirdParty(user: any): Promise<any> {
    const keys = this.createKeys();
    const tokens = await createTokenPair({
      payload: {
        userId: user.id,
        email: user.email,
      },
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    });

    await this._keyTokenService.createOrUpdateKeyToken({
      userId: user.id,
      privateKey: keys.privateKey,
      publicKey: keys.publicKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: filterData({
        fields: ['id', 'username', 'phone', 'avatarUrl', 'email'],
        object: user,
      }),
      tokens,
    };
  }

  public async handleRefreshToken({
    keyStore,
    user,
    refreshToken,
  }: {
    keyStore: keyTokens;
    user: any;
    refreshToken: string;
  }): Promise<any> {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      this._keyTokenService.deleteKeyByUserId({ userId });
      throw new ForbiddenError('Something go wrong');
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailure('Refresh token is wrong');

    const tokens = await createTokenPair({
      payload: { userId, email },
      privateKey: keyStore.privateKey,
      publicKey: keyStore.publicKey,
    });
    const keyToken = await this._keyTokenService.foundKey({
      userId,
    });
    if (!keyToken) throw new AuthFailure('Key token not found');

    const result = await this._keyTokenService.updateKeyToken({
      currentToken: keyToken,
      refreshToken: tokens.refreshToken,
      userId,
    });

    return {
      tokens,
      result,
    };
  }
}
