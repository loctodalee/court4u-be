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
      preOrder?: number;
    }
  ): Promise<club>;
  deleteClub({ id }: { id: string }): Promise<club>;
  updateClubStatus({
    clubId,
    status,
  }: {
    clubId: string;
    status: ClubStatus;
  }): Promise<club>;
  searchByLocation(data: {
    cityOfProvince?: string;
    district?: string;
    address?: string;
    name?: string;
  }): Promise<club[]>;
  updateApiKey({
    userId,
    clubId,
  }: {
    userId: string;
    clubId: string;
  }): Promise<club>;
  getClubsByOwnerId(id: string): Promise<club[]>;
}
