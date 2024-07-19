import { Sex, staffProfile } from '@prisma/client';
import { List } from 'lodash';
import prisma from '../lib/prisma';
import { IStaffProfileRepository } from './interface/iStaffProfile.repository';

export class StaffProfileRepository implements IStaffProfileRepository {
  private static Instance: StaffProfileRepository;
  public static getInstance(): IStaffProfileRepository {
    if (!StaffProfileRepository.Instance) {
      StaffProfileRepository.Instance = new StaffProfileRepository();
    }
    return StaffProfileRepository.Instance;
  }
  public async getStaffProfiles(): Promise<List<staffProfile> | null> {
    const staffs = await prisma.staffProfile.findMany();
    return staffs;
  }
  public async addStaffProfile(data: {
    userId: string;
    clubId: string;
    staffRoles: { id: string; roleId: string }[];
  }) {
    return prisma.staffProfile.create({
      data: {
        userId: data.userId,
        clubId: data.clubId,
      },
    });
  }

  public async getStaffProfileByClubId(
    clubId: string
  ): Promise<staffProfile[]> {
    return await prisma.staffProfile.findMany({
      where: {
        clubId,
      },
      include: {
        user: {
          select: {
            id: true,
            apiKey: true,
            fullname: true,
            email: true,
            phone: true,
            sex: true,
            status: true,
            dateOfBirth: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  public async getStaffProfileByOwnerId(
    ownerId: string
  ): Promise<staffProfile[]> {
    return await prisma.staffProfile.findMany({
      where: {
        club: {
          courtOwnerId: ownerId,
        },
      },
    });
  }
}
