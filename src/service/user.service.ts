import { Sex, user, UserStatus } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './interface/iUser.service';
import {
  AuthFailure,
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { filterData } from '../util/filterData';
import bcrypt from 'bcrypt';

export class UserService implements IUserService {
  private static Instance: UserService;
  public static getInstance(): IUserService {
    if (!this.Instance) {
      this.Instance = new UserService();
    }
    return this.Instance;
  }
  public async getAll(): Promise<any[]> {
    return UserRepository.getInstance().getAll();
  }
  public async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<user | null> {
    const options = {
      where: {
        email,
      },
    };
    return await UserRepository.getInstance().getUser({ options });
  }
  public async getUserByIdFilter({ id }: { id: string }): Promise<any> {
    const options = {
      where: {
        id,
      },
    };
    const result = await UserRepository.getInstance().getUser({ options });
    if (!result) throw new NotFoundError('User not found');
    return filterData({
      fields: [
        'id',
        'fullname',
        'email',
        'phone',
        'sex',
        'avatarUrl',
        'dateOfBirth',
        'status',
        'apiKey',
      ],
      object: result,
    });
  }
  public async getUserById({ id }: { id: string }): Promise<user | null> {
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
    otp,
  }: {
    fullname: string;
    password: string;
    email: string;
    phone: string;
    status: string;
    otp?: string;
  }): Promise<user> {
    const options = {
      data: {
        fullname,
        password,
        email,
        phone,
        status,
        otp,
      },
    };
    return await UserRepository.getInstance().createNewUser({ options });
  }

  public async updateUser({ options }: { options: any }): Promise<user> {
    return await UserRepository.getInstance().updateUser({ options });
  }

  public async updateApiKey({
    apiKey,
    userId,
  }: {
    apiKey: string;
    userId: string;
  }): Promise<user> {
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

  public async updateUserAfterVerify({ otp }: { otp: string }): Promise<user> {
    console.log(otp);
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
  }): Promise<user> {
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
  }): Promise<user> {
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
  }): Promise<user> {
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

  public async changePasswordAfterSignUp({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }): Promise<void> {
    console.log(password);
    const hashPassword = await bcrypt.hash(password, 10);
    await UserRepository.getInstance().updatePassword(userId, hashPassword);
  }

  public async updateUserOtp(otp: string, userId: string): Promise<user> {
    return await UserRepository.getInstance().updateUserOtp(otp, userId);
  }

  public async updateUserInfo({
    id,
    fullname,
    password,
    email,
    sex,
    phone,
    avatarUrl,
    dateOfBirth,
    status,
  }: {
    id: string;
    fullname?: string;
    password?: string;
    email?: string;
    sex?: Sex;
    phone?: string;
    avatarUrl?: string;
    dateOfBirth?: string;
    status?: UserStatus;
  }): Promise<user> {
    const data = {
      fullname,
      password,
      email,
      sex,
      phone,
      avatarUrl,
      dateOfBirth,
      status,
    };
    return await UserRepository.getInstance().updateUserInfo(id, data);
  }
}
