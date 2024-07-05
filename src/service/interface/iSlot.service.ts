import { CourtSlotStatus, slot, slotOnCourt } from '@prisma/client';

export interface ISlotService {
  addSlot({
    clubId,
    startTime,
    endTime,
    dateOfWeek,
  }: {
    clubId: string;
    startTime: Date;
    endTime: Date;
    dateOfWeek: number;
  }): Promise<slot>;

  getSlotByClubId(id: string): Promise<slot[]>;
  findClubInfo({ clubId }: { clubId: string }): Promise<any>;
}
