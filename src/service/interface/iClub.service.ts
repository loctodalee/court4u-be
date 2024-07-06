import { club, ClubStatus } from '@prisma/client';

export interface IClubService {
  addClub({
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
  }): Promise<club>;
  // findClubInfo({ clubId }: { clubId: string }): Promise<any>;
  foundClubById({ clubId }: { clubId: string }): Promise<club | null>;
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
      status?: ClubStatus;
    }
  ): Promise<club>;
  deleteClub({ id }: { id: string }): Promise<club>;
  searchByLocation(data: {
    cityOfProvince?: string;
    district?: string;
    address?: string;
    name?: string;
  }): Promise<club[]>;
}
