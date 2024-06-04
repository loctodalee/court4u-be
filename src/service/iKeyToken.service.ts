import { keyTokens } from '@prisma/client';

export interface IKeyTokenService {
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
  }): Promise<String | null>;
  foundKey({ userId }: { userId: string }): Promise<keyTokens | null>;
  deleteKeyByUserId({ userId }: { userId: string }): Promise<any>;
  updateKeyToken({
    currentToken,
    refreshToken,
    userId,
  }: {
    userId: string;
    refreshToken: string;
    currentToken: keyTokens;
  }): Promise<any>;
}
