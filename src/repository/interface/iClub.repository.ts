import { club, ClubStatus } from '@prisma/client';

export interface IClubRepository {
  addClub({
    courtOwnerId,
    name,
    address,
    district,
    cityOfProvince,
    logoUrl,
    description,
    preOrder,
  }: {
    courtOwnerId: string;
    name: string;
    address: string;
    district: string;
    cityOfProvince: string;
    logoUrl: string | null;
    description: string;
    preOrder: number;
  }): Promise<club>;
  foundClub({ options }: { options: any }): Promise<club | null>;
  getClubs(): Promise<club[]>;
  updateClub(
    clubId: string,
    data: {
      name?: string;
      address?: string;
      district?: string;
      cityOfProvince?: string;
      logoUrl?: string;
      description?: string;
      preOrder?: number;
      status?: ClubStatus;
    }
  ): Promise<club>;
  deleteClub({ id }: { id: string }): Promise<club>;
  searchClub(data: {
    cityOfProvince?: string;
    district?: string;
    address?: string;
    name?: string;
  }): Promise<club[]>;

  getClubsByOwnerId(id: string): Promise<club[]>;
  getClubWithSlotAndSubscription(clubId: string): Promise<any>;
}
