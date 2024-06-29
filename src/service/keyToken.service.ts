import { IKeyTokenService } from './interface/iKeyToken.service';
import { IKeyTokenRepository } from '../repository/interface/iKeyToken.repository';
import { KeyTokenRepository } from '../repository/keyToken.repository';
import { keyTokens } from '@prisma/client';

export class KeyTokenService implements IKeyTokenService {
  private static Instance: KeyTokenService;
  public static getInstance(): KeyTokenService {
    if (!this.Instance) {
      this.Instance = new KeyTokenService();
    }
    return this.Instance;
  }
  private static readonly _tokenRepository: IKeyTokenRepository =
    KeyTokenRepository.getInstance();
  constructor() {}
  async upsertKey({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: string;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
  }): Promise<String | null> {
    const options = {
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
    };
    const token = await KeyTokenService._tokenRepository.upsertKey({ options });
    return token ? token.publicKey : null;
  }

  public async foundKey({
    userId,
  }: {
    userId: string;
  }): Promise<keyTokens | null> {
    const found = await KeyTokenService._tokenRepository.foundKey({ userId });
    return found;
  }

  public async deleteKeyByUserId({ userId }: { userId: string }): Promise<any> {
    const result = await KeyTokenService._tokenRepository.deleteKeyByUserId({
      userId,
    });
    return result;
  }
  public async updateKeyToken({
    currentToken,
    refreshToken,
    userId,
  }: {
    userId: string;
    refreshToken: string;
    currentToken: keyTokens;
  }): Promise<any> {
    const result = await KeyTokenService._tokenRepository.updateKeyToken({
      currentToken,
      refreshToken,
      userId,
    });
    return result;
  }
}
