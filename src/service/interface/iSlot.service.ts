import { CourtSlotStatus, slot, slotOnCourt } from '@prisma/client';

export interface ISlotService {
  createNewSlot({
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

  assignNewSlotOnCourt({
    status,
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt>;

  searchSlotOnCourt(id: string): Promise<slotOnCourt | null>;
}
