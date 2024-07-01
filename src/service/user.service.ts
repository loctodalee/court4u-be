import { users } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './interface/iUser.service';
import { AuthFailure, BadRequestError } from '../handleResponse/error.response';

export class UserService implements IUserService {
  private static Instance: UserService;
  public static getInstance(): IUserService {
    if (!this.Instance) {
      this.Instance = new UserService();
    }
    return this.Instance;
  }
  public async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<users | null> {
    const options = {
      where: {
        email,
      },
    };
    return await UserRepository.getInstance().getUser({ options });
  }

  public async getUserById({ id }: { id: string }): Promise<users | null> {
    const options = {
      where: {
        id,
      },
    };
    return await UserRepository.getInstance().getUser({ options });
  }
  public async createNewUser({
    fullname,
    password,
    email,
    phone,
    status,
    role,
    otp,
  }: {
    fullname: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    role: string[];
    otp: string;
  }): Promise<users> {
    const options = {
      data: {
        fullname,
        password,
        email,
        phone,
        status,
        role,
        otp,
      },
    };
    return await UserRepository.getInstance().createNewUser({ options });
  }

  public async updateUser({ options }: { options: any }): Promise<users> {
    return await UserRepository.getInstance().updateUser({ options });
  }

  public async updateApiKey({
    apiKey,
    userId,
  }: {
    apiKey: string;
    userId: string;
  }): Promise<users> {
    const options = {
      where: {
        id: userId,
      },
      data: {
        apiKey,
      },
    };
    return await UserRepository.getInstance().updateUser({ options });
  }

  public async updateUserAfterVerify({ otp }: { otp: string }): Promise<users> {
    const options = {
      where: {
        otp,
      },
      data: {
        status: 'active',
        otp: null,
      },
    };
    return await UserRepository.getInstance().updateUser({ options });
  }

  public async createOrUpdateGoogleUser({
    email,
    googleId,
    googleAccessToken,
    fullname,
    avatarUrl,
  }: {
    email: string;
    googleId: string;
    googleAccessToken: string;
    fullname: string;
    avatarUrl: string;
  }): Promise<users> {
    const options = {
      where: {
        googleId,
      },
      update: {
        googleAccessToken,
      },
      create: {
        googleId,
        googleAccessToken,
        email,
        fullname,
        avatarUrl,
        status: 'active',
      },
    };
    try {
      const user = await UserRepository.getInstance().upsertUser({ options });
      return user;
    } catch (e) {
      throw new BadRequestError();
    }
  }

  public async createOrUpdateFacebookUser({
    email,
    facebookId,
    facebookAccessToken,
    fullname,
    avatarUrl,
  }: {
    email: string;
    facebookId: string;
    facebookAccessToken: string;
    fullname: string;
    avatarUrl: string;
  }): Promise<users> {
    const options = {
      where: {
        facebookId,
      },
      update: {
        facebookAccessToken,
      },
      create: {
        facebookId,
        facebookAccessToken,
        email,
        fullname,
        avatarUrl,
        status: 'active',
      },
    };
    const user = await UserRepository.getInstance().upsertUser({ options });
    return user;
  }

  public async createStaff({
    fullname,
    password,
    email,
    phone,
    status,
    role,
    otp,
    clubId,
  }: {
    fullname: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    role: string[];
    otp: string;
    clubId: string;
  }): Promise<users> {
    const options = {
      data: {
        fullname,
        password,
        email,
        phone,
        status,
        role,
        otp,
      },
    };
    return await UserRepository.getInstance().createNewUser({ options });
  }
}
