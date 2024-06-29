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
  public async createStaffProfile(data: {
    userId: string;
    clubId: string;
    staffRoles: { id: string; roleId: string }[];
  }) {
    return prisma.staffProfile.create({
      data: {
        userId: data.userId,
        clubId: data.clubId,
        staffRole: {
          create: data.staffRoles.map((role) => ({
            id: role.id,
            clubRoleId: role.roleId,
          })),
        },
      },
      include: {
        staffRole: true,
      },
    });
  }

  public async createUser(data: {
    fullname: string;
    password: string | null;
    email: string;
    phone: string | null;
    sex: Sex;
    avatarUrl: string | null;
    dateOfBirth: Date | null;
  }) {
    return prisma.users.create({
      data: {
        fullname: data.fullname,
        password: data.password,
        email: data.email,
        phone: data.phone,
        sex: data.sex,
        avatarUrl: data.avatarUrl,
        dateOfBirth: data.dateOfBirth,
      },
    });
  }
}
