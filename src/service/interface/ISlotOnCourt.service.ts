import { CourtSlotStatus, slotOnCourt } from '@prisma/client';

export interface ISlotOnCourtService {
  addCourtOnSlot({
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
