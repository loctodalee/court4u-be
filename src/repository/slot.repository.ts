import { slot } from '@prisma/client';
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
    return new Promise((resolve, reject) => {
      redisClient?.get(`slot-${options}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.slot.findMany(options);
          if (result) {
            redisClient.setex(
              `slot-${options}`,
              randomInt(3600, 4200),
              JSON.stringify(result)
            );
          }
          resolve(result);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }
}
