import { club } from '@prisma/client';

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
    }
  ): Promise<club>;
  deleteClub({ id }: { id: string }): Promise<club>;
}
