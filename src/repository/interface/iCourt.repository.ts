import { court, CourtStatus } from '@prisma/client';

export interface ICourtRepository {
  createCourt({
    clubId,
    status,
    number,
  }: {
    clubId: string;
    status: CourtStatus;
    number: number;
  }): Promise<court>;
  getAllCourtByClubId(id: string): Promise<court[]>;
  getCourtBySlotId(slotId: string): Promise<court[]>;
  findExistedCourt(clubId: string, number: number): Promise<court | null>;
}
