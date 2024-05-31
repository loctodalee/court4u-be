import { IKeyTokenService } from "./iKeyToken.service";
import { IKeyTokenRepository } from "../repository/iKeyToken.repository";
import { KeyTokenRepository } from "../repository/keyToken.repository";

export class KeyTokenService implements IKeyTokenService {
  private readonly _tokenRepository: IKeyTokenRepository;
  constructor() {
    this._tokenRepository = KeyTokenRepository.getInstance();
  }
  async createOrUpdateKeyToken({
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
    const token = await this._tokenRepository.createOrUpdateKeyToken({
      userId,
      privateKey,
      publicKey,
      refreshToken,
    });
    return token ? token.publicKey : null;
  }
}
