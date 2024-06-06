import { club } from '@prisma/client';
import { IClubService } from './iClub.service';
import { IClubRepository } from '../repository/iClub.repository';
import { ClubRepository } from '../repository/club.repository';
export class ClubService implements IClubService {
  private readonly _clubRepository: IClubRepository;

  constructor() {
    this._clubRepository = ClubRepository.getInstance();
  }

  public async createClub({
    courtOwnerId,
    name,
    address,
    district,
    cityOfProvince,
    logoUrl = null,
    description = '',
  }: {
    courtOwnerId: string;
    name: string;
    address: string;
    district: string;
    cityOfProvince: string;
    logoUrl: string | null;
    description: string;
  }): Promise<club> {
    return await this._clubRepository.createClub({
      name,
      address,
      cityOfProvince,
      courtOwnerId,
      description,
      district,
      logoUrl,
    });
  }
}
