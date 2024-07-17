import { Sex, staffProfile } from '@prisma/client';
import { List } from 'lodash';

export interface IStaffProfileService {
  getStaffProfiles(): Promise<List<staffProfile> | null>;
  addStaffProfile(data: {
    fullname: string;
    email: string;
    phone: string;
    clubId: string;
  }): Promise<staffProfile>;
  getStaffProfileByClubId(clubId: string): Promise<staffProfile[]>;
}
