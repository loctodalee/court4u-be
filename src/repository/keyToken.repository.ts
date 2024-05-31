import { IKeyTokenRepository } from "./iKeyToken.repository";
import prisma from "../lib/prisma";
import { keyTokens } from "@prisma/client";

export class KeyTokenRepository implements IKeyTokenRepository {
  private static Instance: KeyTokenRepository;
  public static getInstance(): KeyTokenRepository {
    if (!KeyTokenRepository.Instance) {
      KeyTokenRepository.Instance = new KeyTokenRepository();
    }
    return KeyTokenRepository.Instance;
  }

  public async createOrUpdateKeyToken({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: string;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
  }): Promise<keyTokens | null> {
    const token = await prisma.keyTokens.upsert({
      where: {
        userId,
      },
      update: {
        publicKey,
        privateKey,
        refreshToken,
      },
      create: {
        userId,
        publicKey,
        privateKey,
        refreshToken,
      },
    });

    return token ?? null;
  }
}
