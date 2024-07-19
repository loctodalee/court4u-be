import { slot, SlotStatus } from '@prisma/client';
import { ISlotRepository } from './interface/iSlot.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
import { deleteKeysByPattern } from '../util/deleteKeysByPattern';
const { instanceConnect: redisClient } = getRedis();

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
    deleteKeysByPattern(`slot-`);
    return result;
  }

  public async findManySlot({ options }: { options: any }): Promise<slot[]> {
    const result = await prisma.slot.findMany(options);

    return result;
  }

  public async findSlotByDateListAndClubId(
    clubId: string,
    listDate: number[]
  ): Promise<slot[]> {
    const result = await prisma.slot.findMany({
      where: {
        AND: [
          {
            clubId,
          },
          {
            dateOfWeek: {
              in: listDate,
            },
          },
        ],
      },
    });
    return result;
  }

  public async updateSlot(
    slotId: string,
    data: {
      startTime?: Date;
      endTime?: Date;
      dateOfWeek?: number;
      price?: number;
      status?: SlotStatus;
    }
  ): Promise<slot> {
    return await prisma.slot.update({
      where: {
        id: slotId,
      },
      data,
    });
  }

  public async findExistedSlot(
    clubId: string,
    dateOfWeek: number,
    startTime: Date,
    endTime: Date
  ): Promise<slot[] | null> {
    // Create valid times for comparison
    const validStartTime = new Date(
      0,
      0,
      0,
      startTime.getHours(),
      startTime.getMinutes(),
      0
    );
    const validEndTime = new Date(
      0,
      0,
      0,
      endTime.getHours(),
      endTime.getMinutes(),
      0
    );

    // Fetch slots from the database
    const result = await prisma.slot.findMany({
      where: {
        dateOfWeek,
        clubId,
      },
    });

    // Return null if no results
    if (!result || result.length === 0) {
      return null;
    }

    // Filter matching slots
    const matchingSlots = result.filter((x) => {
      const startSlot = new Date(x.startTime);
      const endSlot = new Date(x.endTime);

      const validStartSlot = new Date(
        0,
        0,
        0,
        startSlot.getHours(),
        startSlot.getMinutes(),
        0
      );
      const validEndSlot = new Date(
        0,
        0,
        0,
        endSlot.getHours(),
        endSlot.getMinutes(),
        0
      );

      console.log('Input Start Time:', validStartTime);
      console.log('Slot Start Time:', validStartSlot);
      console.log('Input End Time:', validEndTime);
      console.log('Slot End Time:', validEndSlot);

      return (
        validStartTime.getTime() === validStartSlot.getTime() &&
        validEndTime.getTime() === validEndSlot.getTime()
      );
    });

    return matchingSlots.length > 0 ? matchingSlots : null;
  }
}
