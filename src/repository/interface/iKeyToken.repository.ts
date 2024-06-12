import { keyTokens } from '@prisma/client';

export interface IKeyTokenRepository {
  upsertKey({ options }: { options: any }): Promise<keyTokens | null>;

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
