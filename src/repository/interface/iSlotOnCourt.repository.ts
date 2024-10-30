import { CourtSlotStatus, slotOnCourt, slot } from '@prisma/client';
import { slotOnCourtData } from '../../service/slotOnCourt.service';

export interface ISlotOnCourtRepository {
  addCourtOnSlot(data: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt>;
  findUniqueSlotOnCourt({
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
  }): Promise<slotOnCourt | null>;
  searchSlotOnCourt(id: string): Promise<slotOnCourt | null>;
  getAllSlotOnCourt(): Promise<slotOnCourt[]>;
  getAllCourtBySlotId(id: string): Promise<slotOnCourt[] | null>;
  addManySlotOnCourt(slotOnCourtList: slotOnCourtData[]): Promise<any>;
}
