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
    const result = await prisma.slot.findMany({
      where: {
        dateOfWeek,
        clubId,
      },
    });
    if (!result) {
      return null;
    }
    result.forEach((x) => {
      let validStartSlot = new Date(
        0,
        0,
        0,
        x.startTime.getHours(),
        x.startTime.getMinutes(),
        0
      );
      let validEndSlot = new Date(
        0,
        0,
        0,
        x.endTime.getHours(),
        x.endTime.getMinutes(),
        0
      );
      console.log(validStartTime);
      console.log(validStartSlot);
      console.log(validEndTime);
      console.log(validEndSlot);
      return validEndSlot == validEndTime || validStartTime == validStartSlot;
    });
    return result;
  }
}
