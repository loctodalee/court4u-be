import { createTokenPair } from '../auth/authUtils';
import {
  AuthFailure,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  NotImplementError,
} from '../handleResponse/error.response';
import { IAuthService } from './interface/iAuth.service';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { IKeyTokenService } from './interface/iKeyToken.service';
import { KeyTokenService } from './keyToken.service';
import { filterData } from '../util/filterData';
import { IEmailService } from './interface/iEmail.service';
import { EmailService } from './email.service';
import { keyTokens } from '@prisma/client';
import { IUserService } from './interface/iUser.service';
import { UserService } from './user.service';
import passport from 'passport';
import { IRoleService } from './interface/iRole.service';
import { RoleService } from './role.service';
import { response } from 'express';
export class AuthService implements IAuthService {
  private static Instance: AuthService;
  public static getInstance(): IAuthService {
    if (!this.Instance) {
      this.Instance = new AuthService();
    }
    return this.Instance;
  }
  private static _keyTokenService: IKeyTokenService;
  private static _userService: IUserService;
  private static _emailService: IEmailService;
  private static _roleService: IRoleService;

  static {
    this._keyTokenService = KeyTokenService.getInstance();
    this._userService = UserService.getInstance();
    this._emailService = EmailService.getInstance();
    this._roleService = RoleService.getInstance();
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
    const foundUser = await AuthService._userService.getUserByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError('Login fail');
    }
    if (foundUser.password == null) throw new BadRequestError('Login fail');
    if (foundUser.status == 'disable') throw new BadRequestError('Login fail');
    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      throw new BadRequestError('Login fail');
    }

    //get roles
    const foundRole = await AuthService._roleService.findUserRole({
      userId: foundUser.id,
    });
    if (!foundRole) throw new BadRequestError('Login fail');
    const listRole = await AuthService._roleService.findRoleName(foundRole);
    const listName = listRole.map((x) => x.name);
    //create public key for accessToken, private key for refreshToken
    const keys = this.createKeys();

    //create accessToken and RefreshToken
    const tokens = await createTokenPair({
      payload: {
        userId: foundUser.id,
        email: foundUser.email,
        roles: listName,
      },
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    });

    await AuthService._keyTokenService.upsertKey({
      userId: foundUser.id,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      refreshToken: tokens.refreshToken,
    });
    const apiKey = foundUser.apiKey;
    return {
      tokens,
      apiKey,
    };
  }
  //end login
  // -------- new court owner
  public async newCourtOwner({
    fullname,
    password,
    phone,
    email,
  }: {
    fullname: string;
    password: string;
    phone: string;
    email: string;
  }): Promise<any> {
    const foundUser = await AuthService._userService.getUserByEmail({ email });
    if (foundUser) {
      throw new NotImplementError('Email already existed');
    }

    // send mail
    const result = await AuthService._emailService.sendEmailToken({ email });
    console.log(result);
    // create user with status = false
    const hashPassword = await bcrypt.hash(password, 10);

    var user = await AuthService._userService.createNewUser({
      email,
      password: hashPassword,
      otp: result.toString(),
      phone,
      status: 'disable',
      fullname,
      // role: ['owner'],
    });
    const roleMember = await AuthService._roleService.findByName('owner');
    if (!roleMember) throw new BadRequestError('Not found role');
    await AuthService._roleService.assignRoleToUser({
      roleId: roleMember.id,
      userId: user.id,
    });
    return {
      message: 'Verify email court owner',
    };
  }

  // ---------new customer
  public async newUser({
    fullname,
    password,
    phone,
    email,
  }: {
    fullname: string;
    password: string;
    phone: string;
    email: string;
  }): Promise<any> {
    const foundUser = await AuthService._userService.getUserByEmail({ email });
    if (foundUser) {
      throw new NotImplementError('Email already existed');
    }

    // send mail
    const result = await AuthService._emailService.sendEmailToken({ email });
    console.log(result);
    // create user with status = false
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await AuthService._userService.createNewUser({
      email,
      password: hashPassword,
      otp: result.toString(),
      phone,
      status: 'disable',
      fullname,
    });

    const roleMember = await AuthService._roleService.findByName('member');
    if (!roleMember) throw new BadRequestError('Not found role');
    await AuthService._roleService.assignRoleToUser({
      roleId: roleMember.id,
      userId: user.id,
    });
    return {
      message: 'Verify email user',
    };
  }

  //---------- check email token
  public async checkLoginEmailToken({ token }: { token: any }): Promise<any> {
    // search and update status, set otp user to null

    const foundUser = await AuthService._userService.updateUserAfterVerify({
      otp: token,
    });

    if (!foundUser) throw new NotFoundError('Token not found');
    const keys = this.createKeys();
    const foundRole = await AuthService._roleService.findUserRole({
      userId: foundUser.id,
    });
    if (!foundRole) throw new BadRequestError('Login fail');
    const listRole = await AuthService._roleService.findRoleName(foundRole);
    const listName = listRole.map((x) => x.name);
    const tokens = await createTokenPair({
      payload: {
        userId: foundUser.id,
        email: foundUser.email,
        roles: listName,
      },
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    });

    await AuthService._keyTokenService.upsertKey({
      userId: foundUser.id,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      user: filterData({
        fields: ['id', 'fullname', 'phone', 'avatarUrl', 'email', 'apiKey'],
        object: foundUser,
      }),
      tokens: tokens,
    };
  }

  //--------login with third party
  public async loginWithThirdParty(user: any): Promise<any> {
    const keys = this.createKeys();
    const foundRole = await AuthService._roleService.findUserRole({
      userId: user.id,
    });
    if (!foundRole) throw new BadRequestError('Login fail');
    const listRole = await AuthService._roleService.findRoleName(foundRole);
    const listName = listRole.map((x) => x.name);
    const tokens = await createTokenPair({
      payload: {
        userId: user.id,
        email: user.email,
        roles: listName,
      },
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
    });

    await AuthService._keyTokenService.upsertKey({
      userId: user.id,
      publicKey: keys.publicKey,
      privateKey: keys.privateKey,
      refreshToken: tokens.refreshToken,
    });
    // console.log(tokens);
    return tokens;
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
    const foundRole = await AuthService._roleService.findUserRole({
      userId: user.id,
    });
    if (!foundRole) throw new BadRequestError('Login fail');
    const listRole = await AuthService._roleService.findRoleName(foundRole);
    const listName = listRole.map((x) => x.name);
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      AuthService._keyTokenService.deleteKeyByUserId({ userId });
      throw new ForbiddenError('Something go wrong');
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailure('Refresh token is wrong');

    const tokens = await createTokenPair({
      payload: { userId, email },
      privateKey: keyStore.privateKey,
      publicKey: keyStore.publicKey,
    });
    const keyToken = await AuthService._keyTokenService.foundKey({
      userId,
    });
    if (!keyToken) throw new AuthFailure('Key token not found');

    const result = await AuthService._keyTokenService.updateKeyToken({
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
