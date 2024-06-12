import { PrismaClient, clubImage } from '@prisma/client';
import { List } from 'lodash';
import { IClubImageRepository } from './interface/iClubImage.repository';

const prisma = new PrismaClient();

export class ClubImageRepository implements IClubImageRepository {
  private static instance: ClubImageRepository;

  public static getInstance(): ClubImageRepository {
    if (!ClubImageRepository.instance) {
      ClubImageRepository.instance = new ClubImageRepository();
    }
    return ClubImageRepository.instance;
  }

  public async getClubImageById(id: string): Promise<clubImage | null> {
    return prisma.clubImage.findUnique({ where: { id } });
  }

  public async getAllClubImages(): Promise<List<clubImage>> {
    return prisma.clubImage.findMany();
  }

  public async createClubImage(data: {
    clubId: string;
    name: string;
    url: string;
  }): Promise<clubImage> {
    return prisma.clubImage.create({ data });
  }

  public async updateClubImage(
    id: string,
    data: {
      clubId?: string;
      name?: string;
      url?: string;
    }
  ): Promise<clubImage | null> {
    return prisma.clubImage.update({
      where: { id },
      data,
    });
  }

  public async deleteClubImage(id: string): Promise<clubImage | null> {
    return prisma.clubImage.delete({ where: { id } });
  }
}
