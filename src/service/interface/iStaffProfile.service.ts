import { Sex, staffProfile } from '@prisma/client';
import { List } from 'lodash';

export interface IStaffProfileService {
  getStaffProfiles(): Promise<List<staffProfile> | null>;
  createStaffProfile(data: {
    fullname: string;
    password: string | null;
    email: string;
    phone: string | null;
    sex: Sex;
    avatarUrl: string | null;
    dateOfBirth: Date | null;
    clubId: string;
    staffRoles: { id: string; roleId: string }[];
  }): Promise<staffProfile>;
}
