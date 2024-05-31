import { createTokenPair } from "../auth/authUtils";
import { BadRequestError } from "../handleError/error.response";
import { IUserRepository } from "../repository/iUser.repository";
import { UserRepository } from "../repository/user.repository";
import { IAuthService } from "./iAuth.service";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { IKeyTokenService } from "./iKeyToken.service";
import { KeyTokenService } from "./keyToken.service";
import { filterData } from "../util/filterData";

export class AuthService implements IAuthService {
  private readonly _userRepository: IUserRepository;
  private readonly _keyTokenService: IKeyTokenService;
  constructor() {
    this._keyTokenService = new KeyTokenService();
    this._userRepository = UserRepository.getInstance();
  }
  //create public key and private key
  createKeys = () => {
    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
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
      throw new BadRequestError("Login fail");
    }
    const match = await bcrypt.compare(password, foundUser.email);

    if (!match) {
      throw new BadRequestError("Login fail");
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
        fields: ["id", "username", "phone", "avatarUrl", "email"],
        object: foundUser,
      }),
    };
  }

  //end login
}
