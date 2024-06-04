import { keyTokens } from '@prisma/client';

export interface IKeyTokenRepository {
  createOrUpdateKeyToken({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: string;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
  }): Promise<keyTokens | null>;

  foundKey({ userId }: { userId: string }): Promise<keyTokens | null>;
  deleteKeyByUserId({ userId }: { userId: string }): Promise<any>;
  updateKeyToken({
    userId,
    refreshToken,
    currentToken,
  }: {
    userId: string;
    refreshToken: string;
    currentToken: keyTokens;
  }): Promise<any>;
}
