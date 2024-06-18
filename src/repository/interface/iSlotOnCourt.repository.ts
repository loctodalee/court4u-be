import { CourtSlotStatus, slotOnCourt, slot } from '@prisma/client';

export interface ISlotOnCourtRepository {
  createSlotOnCourt(data: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt>;

  searchSlotOnCourt(id: string): Promise<slotOnCourt | null>;
  getAllSlotOnCourt(): Promise<slotOnCourt[]>;
}
