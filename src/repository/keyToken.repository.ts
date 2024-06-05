import { IKeyTokenRepository } from './iKeyToken.repository';
import prisma from '../lib/prisma';
import { keyTokens } from '@prisma/client';

export class KeyTokenRepository implements IKeyTokenRepository {
  private static Instance: KeyTokenRepository;
  public static getInstance(): KeyTokenRepository {
    if (!KeyTokenRepository.Instance) {
      KeyTokenRepository.Instance = new KeyTokenRepository();
    }
    return KeyTokenRepository.Instance;
  }

  public async upsertKey({
    options,
  }: {
    options: any;
  }): Promise<keyTokens | null> {
    const token = await prisma.keyTokens.upsert(options);

    return token ?? null;
  }

  public async foundKey({
    userId,
  }: {
    userId: string;
  }): Promise<keyTokens | null> {
    const found = await prisma.keyTokens.findFirst({
      where: {
        userId,
      },
    });
    return found;
  }

  public async deleteKeyByUserId({ userId }: { userId: string }): Promise<any> {
    const result = await prisma.keyTokens.delete({
      where: {
        userId,
      },
    });
    return result;
  }

  public async updateKeyToken({
    userId,
    refreshToken,
    currentToken,
  }: {
    userId: string;
    refreshToken: string;
    currentToken: keyTokens;
  }): Promise<any> {
    await prisma.keyTokens.update({
      where: {
        userId,
      },
      data: {
        refreshTokenUsed: [
          ...currentToken.refreshTokenUsed,
          currentToken.refreshToken,
        ],
        refreshToken,
      },
    });
  }
}
