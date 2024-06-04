import { users } from '@prisma/client';
import prisma from '../lib/prisma';
import { IUserRepository } from './iUser.repository';
import { AuthFailure } from '../handleResponse/error.response';

export class UserRepository implements IUserRepository {
  private static Instance: UserRepository;
  public static getInstance(): UserRepository {
    if (!UserRepository.Instance) {
      UserRepository.Instance = new UserRepository();
    }
    return UserRepository.Instance;
  }

  //get user by id
  public async getUserById(id: string): Promise<users | null> {
    return await prisma.users.findFirst({
      where: {
        id,
      },
    });
  }
  // get user by email
  public async getUserByEmail({
    email,
  }: {
    email: string;
  }): Promise<users | null> {
    return await prisma.users.findFirst({
      where: {
        email,
      },
    });
  }

  public async createOrUpdateGoogleUser({
    email,
    googleId,
    googleAccessToken,
    username,
    avatarUrl,
  }: {
    email: string;
    googleId: string;
    googleAccessToken: string;
    username: string;
    avatarUrl: string;
  }): Promise<users> {
    var user = await prisma.users.upsert({
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
        username,
        avatarUrl,
        status: 'active',
      },
    });
    return user;
  }

  public async createOrUpdateFacebookUser({
    email,
    facebookId,
    facebookAccessToken,
    username,
    avatarUrl,
  }: {
    email: string;
    facebookId: string;
    facebookAccessToken: string;
    username: string;
    avatarUrl: string;
  }): Promise<users> {
    var user = await prisma.users.upsert({
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
        username,
        avatarUrl,
        status: 'active',
      },
    });
    return user;
  }
}
