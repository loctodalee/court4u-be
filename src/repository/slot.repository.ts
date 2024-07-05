import { slot } from '@prisma/client';
import { ISlotRepository } from './interface/iSlot.repository';
import prisma from '../lib/prisma';

export class SlotRepository implements ISlotRepository {
  private static Instance: SlotRepository;
  public static getInstance(): ISlotRepository {
    if (!this.Instance) {
      this.Instance = new SlotRepository();
    }
    return this.Instance;
  }

  public async addSlot({
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
  }): Promise<slot> {
    var result = await prisma.slot.create({
      data: {
        clubId,
        startTime,
        endTime,
        dateOfWeek,
        price,
      },
    });
    return result;
  }

  public async findManySlot({ options }: { options: any }): Promise<slot[]> {
    return await prisma.slot.findMany(options);
  }

  // public async findSlotsWithDateAndClubId({
  //   clubId,
  //   startDate,
  //   endDate,
  // }: {
  //   clubId: string;
  //   startDate: Date;
  //   endDate: Date;
  // }): Promise<slot[]>{
  //   return await prisma.slot.findMany({
  //     where:{

  //     }
  //   })
  // }
}
