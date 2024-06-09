import { club } from '@prisma/client';
import { IClubService } from './iClub.service';
import { IClubRepository } from '../repository/iClub.repository';
import { ClubRepository } from '../repository/club.repository';
import { IUserService } from './iUser.service';
import { UserService } from './user.service';
import prisma from '../lib/prisma';
export class ClubService implements IClubService {
  private readonly _clubRepository: IClubRepository;
  private readonly _userService: IUserService;
  constructor() {
    this._userService = new UserService();
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
    const newClub = await this._clubRepository.createClub({
      name,
      address,
      cityOfProvince,
      courtOwnerId,
      description,
      district,
      logoUrl,
    });
    await this._userService.updateApiKey({
      apiKey: newClub.apiKey,
      userId: courtOwnerId,
    });
    return newClub;
  }

  public async foundClubById({
    clubId,
  }: {
    clubId: string;
  }): Promise<club | null> {
    return this._clubRepository.foundClub({
      options: {
        where: {
          id: clubId,
        },
      },
    });
  }
}
