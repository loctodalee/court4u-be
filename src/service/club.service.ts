import { club } from '@prisma/client';
import { IClubService } from './interface/iClub.service';
import { IClubRepository } from '../repository/interface/iClub.repository';
import { ClubRepository } from '../repository/club.repository';
import { IUserService } from './interface/iUser.service';
import { UserService } from './user.service';
import { BadRequestError } from '../handleResponse/error.response';

export class ClubService implements IClubService {
  private static Instance: ClubService;
  public static getInstance(): ClubService {
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
  // public async findClubInfo({ clubId }: { clubId: string }): Promise<any> {
  //   var club = await ClubService._clubRepository.foundClub({
  //     options: {
  //       where: {
  //         id: clubId,
  //       },
  //     },
  //   });
  //   if (!club) throw new BadRequestError('Club not found!');
  //   var slot = ClubService._slotService.getSlotByClubId(club.id);
  //   return {
  //     club,
  //     slot,
  //   };
  // }
  public async addClub({
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
    const newClub = await ClubService._clubRepository.addClub({
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

  public async getClubs(): Promise<club[]> {
    var clubs = await ClubService._clubRepository.getClubs();
    if (!clubs) {
      throw new BadRequestError();
    }
    return clubs;
  }

  public async updateClub(
    clubId: string,
    data: {
      name?: string;
      address?: string;
      district?: string;
      cityOfProvince?: string;
      logoUrl?: string;
      description?: string;
    }
  ): Promise<club> {
    var result = await ClubService._clubRepository.updateClub(clubId, data);
    return result;
  }

  public async deleteClub({ id }: { id: string }): Promise<club> {
    var result = await ClubService._clubRepository.deleteClub({ id });
    return result;
  }
}
