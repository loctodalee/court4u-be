import { keyTokens } from "@prisma/client";

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
}
