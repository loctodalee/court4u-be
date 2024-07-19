import { CourtSlotStatus, slot, slotOnCourt } from '@prisma/client';

export interface ISlotService {
  addSlot({
    clubId,
    startTime,
    endTime,
    dateOfWeek,
    price,
  }: {
    clubId: string;
    startTime: Date;
    endTime: Date;
    dateOfWeek: number;
    price: number;
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
  getSlotInfo({
    clubId,
    startDate,
  }: {
    clubId: string;
    startDate: Date;
  }): Promise<any>;
  deleteSlot({
    clubId,
    slotId,
  }: {
    clubId: string;
    slotId: string;
  }): Promise<slot>;
  test({
    clubId,
    dateOfWeek,
    startTime,
    endTime,
  }: {
    clubId: string;
    dateOfWeek: number;
    startTime: Date;
    endTime: Date;
  }): Promise<any>;
}
