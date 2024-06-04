import { users } from '@prisma/client';
import { UserRepository } from '../repository/user.repository';
import { IUserService } from './iUser.service';

export class UserService implements IUserService {
  public async getUserById(id: string): Promise<users | undefined> {
    var user: users | null = null;
    await UserRepository.getInstance()
      .getUserById(id)
      .then((u) => {
        user = u;
      });
    if (user != null) {
      return user;
    }
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
    const user = await UserRepository.getInstance().createOrUpdateGoogleUser({
      email,
      googleId,
      googleAccessToken,
      username,
      avatarUrl,
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
    const user = await UserRepository.getInstance().createOrUpdateFacebookUser({
      email,
      facebookId,
      facebookAccessToken,
      username,
      avatarUrl,
    });
    return user;
  }
}
