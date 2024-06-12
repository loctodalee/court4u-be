import { clubImage } from '@prisma/client';
import { List } from 'lodash';
import { ClubImageRepository } from '../repository/clubImage.repository';
import { IClubImageService } from './interface/iClubImage.service';

export class ClubImageService implements IClubImageService {
  private clubImageRepository: ClubImageRepository;

  constructor() {
    this.clubImageRepository = ClubImageRepository.getInstance();
  }

  public async getClubImageById(id: string): Promise<clubImage | null> {
    return this.clubImageRepository.getClubImageById(id);
  }

  public async getAllClubImages(): Promise<List<clubImage>> {
    return this.clubImageRepository.getAllClubImages();
  }

  public async createClubImage(data: {
    clubId: string;
    name: string;
    url: string;
  }): Promise<clubImage> {
    return this.clubImageRepository.createClubImage(data);
  }

  public async updateClubImage(
    id: string,
    data: {
      clubId?: string;
      name?: string;
      url?: string;
    }
  ): Promise<clubImage | null> {
    return this.clubImageRepository.updateClubImage(id, data);
  }

  public async deleteClubImage(id: string): Promise<clubImage | null> {
    return this.clubImageRepository.deleteClubImage(id);
  }
}
