import { clubImage } from '@prisma/client';
import { List } from 'lodash';

export interface IClubImageRepository {
  getClubImageById(id: string): Promise<clubImage | null>;
  getAllClubImages(): Promise<List<clubImage>>;
  createClubImage(data: {
    clubId: string;
    name: string;
    url: string;
  }): Promise<clubImage>;
  updateClubImage(
    id: string,
    data: {
      clubId?: string;
      name?: string;
      url?: string;
    }
  ): Promise<clubImage | null>;
  deleteClubImage(id: string): Promise<clubImage | null>;
}
