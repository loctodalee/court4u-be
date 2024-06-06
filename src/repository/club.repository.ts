import { club } from '@prisma/client';
import { IClubRepository } from './iClub.repository';
import prisma from '../lib/prisma';

export class ClubRepository implements IClubRepository {
  private static Instance: ClubRepository;
  public static getInstance(): ClubRepository {
    if (!ClubRepository.Instance) {
      ClubRepository.Instance = new ClubRepository();
    }
    return ClubRepository.Instance;
  }
  public async createClub({
    courtOwnerId,
    name,
    address,
    district,
    cityOfProvince,
    logoUrl,
    description,
  }: {
    courtOwnerId: string;
    name: string;
    address: string;
    district: string;
    cityOfProvince: string;
    logoUrl: string | null;
    description: string;
  }): Promise<club> {
    return await prisma.club.create({
      data: {
        courtOwnerId,
        address,
        cityOfProvince,
        district,
        name,
        description,
        logoUrl,
      },
    });
  }
}
