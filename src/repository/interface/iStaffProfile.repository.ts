import { Sex, staffProfile, user } from '@prisma/client';
import { List } from 'lodash';

export interface IStaffProfileRepository {
  getStaffProfiles(): Promise<List<staffProfile> | null>;
  addStaffProfile(data: {
    userId: string;
    clubId: string;
  }): Promise<staffProfile>;
  createUser(data: {
    fullname: string;
    password: string | null;
    email: string;
    phone: string | null;
    sex: Sex;
    avatarUrl: string | null;
    dateOfBirth: Date | null;
  }): Promise<user>;
}
