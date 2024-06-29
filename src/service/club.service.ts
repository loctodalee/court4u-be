import { club } from '@prisma/client';
import { IClubService } from './interface/iClub.service';
import { IClubRepository } from '../repository/interface/iClub.repository';
import { ClubRepository } from '../repository/club.repository';
import { IUserService } from './interface/iUser.service';
import { UserService } from './user.service';
export class ClubService implements IClubService {
  private static Instance: ClubService;
  public static getInstance(): IClubService {
    if (!this.Instance) {
      this.Instance = new ClubService();
    }
    return this.Instance;
  }
  private static _clubRepository: IClubRepository;
  private static _userService: IUserService;
  static {
    this._userService = UserService.getInstance();
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
    const newClub = await ClubService._clubRepository.createClub({
      name,
      address,
      cityOfProvince,
      courtOwnerId,
      description,
      district,
      logoUrl,
    });
    await ClubService._userService.updateApiKey({
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
    return ClubService._clubRepository.foundClub({
      options: {
        where: {
          id: clubId,
        },
      },
    });
  }
}
