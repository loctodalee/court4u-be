import { CourtSlotStatus, slotOnCourt } from '@prisma/client';
import { ISlotOnCourtRepository } from './interface/iSlotOnCourt.repository';
import prisma from '../lib/prisma';
export class slotOnCourtRepository implements ISlotOnCourtRepository {
  private static Instance: slotOnCourtRepository;
  public static getInstance(): slotOnCourtRepository {
    if (!this.Instance) {
      this.Instance = new slotOnCourtRepository();
    }
    return this.Instance;
  }

  public async createSlotOnCourt(data: {
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
}
