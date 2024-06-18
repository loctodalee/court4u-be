import { Sex, staffProfile } from '@prisma/client';
import { List } from 'lodash';
import { StaffProfileRepository } from '../repository/staffProfile.repository';
import { IStaffProfileService } from './interface/iStaffProfile.service';

export class StaffProfileService implements IStaffProfileService {
  private static Instance: StaffProfileService;

  public static getInstance(): StaffProfileService {
    if (!StaffProfileService.Instance) {
      StaffProfileService.Instance = new StaffProfileService();
    }
    return StaffProfileService.Instance;
  }

  public async getStaffProfiles(): Promise<List<staffProfile> | null> {
    const staffProfile =
      await StaffProfileRepository.getInstance().getStaffProfiles();
    return staffProfile;
  }

  public async createStaffProfile(data: {
    fullname: string;
    password: string | null;
    email: string;
    phone: string | null;
    sex: Sex;
    avatarUrl: string | null;
    dateOfBirth: Date | null;
    clubId: string;
    staffRoles: { id: string; roleId: string }[];
  }): Promise<staffProfile> {
    const newUser = await StaffProfileRepository.getInstance().createUser({
      fullname: data.fullname,
      password: data.password,
      email: data.email,
      phone: data.phone,
      sex: data.sex,
      avatarUrl: data.avatarUrl,
      dateOfBirth: data.dateOfBirth,
    });
    return await StaffProfileRepository.getInstance().createStaffProfile({
      userId: newUser.id,
      clubId: data.clubId,
      staffRoles: data.staffRoles,
    });
  }
}
