import { CourtSlotStatus, slotOnCourt } from '@prisma/client';
import { ISlotOnCourtRepository } from './interface/iSlotOnCourt.repository';
import prisma from '../lib/prisma';
export class SlotOnCourtRepository implements ISlotOnCourtRepository {
  private static Instance: SlotOnCourtRepository;
  public static getInstance(): ISlotOnCourtRepository {
    if (!this.Instance) {
      this.Instance = new SlotOnCourtRepository();
    }
    return this.Instance;
  }

  public async addCourtOnSlot(data: {
    slotId: string;
    courtId: string;
    status: CourtSlotStatus;
  }): Promise<slotOnCourt> {
    return await prisma.slotOnCourt.create({
      data,
    });
  }

  public async searchSlotOnCourt(id: string): Promise<slotOnCourt | null> {
    return await prisma.slotOnCourt.findFirst({
      where: {
        id,
      },
    });
  }

  public async getAllSlotOnCourt(): Promise<slotOnCourt[]> {
    return await prisma.slotOnCourt.findMany();
  }

  public async findUniqueSlotOnCourt({
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
  }): Promise<slotOnCourt | null> {
    return await prisma.slotOnCourt.findFirst({
      where: {
        slotId,
        courtId,
      },
    });
  }
}
