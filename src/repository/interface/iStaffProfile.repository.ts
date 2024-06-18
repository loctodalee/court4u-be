import { Sex, staffProfile, users } from '@prisma/client';
import { List } from 'lodash';

export interface IStaffProfileRepository {
  getStaffProfiles(): Promise<List<staffProfile> | null>;
  createStaffProfile(data: {
    userId: string;
    clubId: string;
    staffRoles: { id: string; roleId: string }[];
  }): Promise<staffProfile>;
  createUser(data: {
    fullname: string;
    password: string | null;
    email: string;
    phone: string | null;
    sex: Sex;
    avatarUrl: string | null;
    dateOfBirth: Date | null;
  }): Promise<users>;
}
