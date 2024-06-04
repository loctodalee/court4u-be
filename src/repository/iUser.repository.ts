import { users } from '@prisma/client';

export interface IUserRepository {
  getUserById(id: string): Promise<users | null>;
  getUserByEmail({ email }: { email: string }): Promise<users | null>;
  createOrUpdateGoogleUser({
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
  }): Promise<users>;
  createOrUpdateFacebookUser({
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
  }): Promise<users>;
}
