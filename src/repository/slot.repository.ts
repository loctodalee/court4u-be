import { slot } from '@prisma/client';
import { ISlotRepository } from './interface/iSlot.repository';
import prisma from '../lib/prisma';

export class SlotRepository implements ISlotRepository {
  private static Instance: SlotRepository;
  public static getInstance(): SlotRepository {
    if (!this.Instance) {
      this.Instance = new SlotRepository();
    }
    return this.Instance;
  }

  public async createSlot({
    clubId,
    startTime,
    endTime,
    dateOfWeek,
  }: {
    clubId: string;
    startTime: Date;
    endTime: Date;
    dateOfWeek: number;
  }): Promise<slot> {
    return await prisma.slot.create({
      data: {
        clubId,
        startTime,
        endTime,
        dateOfWeek,
      },
    });
  }
}
