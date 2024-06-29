import { clubImage } from '@prisma/client';
import { List } from 'lodash';
import { ClubImageRepository } from '../repository/clubImage.repository';
import { IClubImageService } from './interface/iClubImage.service';

export class ClubImageService implements IClubImageService {
  private static Instance: ClubImageService;
  public static getInstance(): ClubImageService {
    if (!this.Instance) {
      this.Instance = new ClubImageService();
    }
    return this.Instance;
  }
  private static clubImageRepository: ClubImageRepository;

  static {
    this.clubImageRepository = ClubImageRepository.getInstance();
  }

  public async getClubImageById(id: string): Promise<clubImage | null> {
    return ClubImageService.clubImageRepository.getClubImageById(id);
  }

  public async getAllClubImages(): Promise<List<clubImage>> {
    return ClubImageService.clubImageRepository.getAllClubImages();
  }

  public async createClubImage(data: {
    clubId: string;
    name: string;
    url: string;
  }): Promise<clubImage> {
    return ClubImageService.clubImageRepository.createClubImage(data);
  }

  public async updateClubImage(
    id: string,
    data: {
      clubId?: string;
      name?: string;
      url?: string;
    }
  ): Promise<clubImage | null> {
    return ClubImageService.clubImageRepository.updateClubImage(id, data);
  }

  public async deleteClubImage(id: string): Promise<clubImage | null> {
    return ClubImageService.clubImageRepository.deleteClubImage(id);
  }
}
