import { court, CourtStatus } from '@prisma/client';

export interface ICourtService {
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
  getCourtsBySlotId(slotId: string): Promise<court[]>;
}
