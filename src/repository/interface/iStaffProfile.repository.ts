import { Sex, staffProfile, user } from '@prisma/client';
import { List } from 'lodash';

export interface IStaffProfileRepository {
  getStaffProfiles(): Promise<List<staffProfile> | null>;
  addStaffProfile(data: {
    userId: string;
    clubId: string;
  }): Promise<staffProfile>;

  getStaffProfileByClubId(clubId: string): Promise<staffProfile[]>;
  getStaffProfileByOwnerId(ownerId: string): Promise<staffProfile[]>;
}
