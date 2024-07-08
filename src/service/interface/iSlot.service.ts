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
  getSlotInfoByClubIdAndDate({
    clubId,
    startDate,
    endDate,
  }: {
    clubId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<any>;
  getClubWithDateTime(date: Date, time: Date): Promise<any>;
}
