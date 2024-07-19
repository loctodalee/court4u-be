import { CourtSlotStatus, slotOnCourt } from '@prisma/client';
import { ISlotOnCourtRepository } from './interface/iSlotOnCourt.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
import { slotOnCourtData } from '../service/slotOnCourt.service';
const { instanceConnect: redisClient } = getRedis();

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
    let result = await prisma.slotOnCourt.create({
      data,
    });
    redisClient?.del(`slotOnCourt-all`);
    const getAll = await prisma.slotOnCourt.findMany();
    redisClient?.setex(
      `slotOnCourt-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    redisClient?.del(`court-slot-${data.slotId}`);
    return result;
  }

  public async searchSlotOnCourt(id: string): Promise<slotOnCourt | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`slotOnCourt-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.slotOnCourt.findFirst({
            where: {
              id,
            },
          });
          if (result) {
            redisClient.setex(
              `slotOnCourt-${id}`,
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

  public async getAllSlotOnCourt(): Promise<slotOnCourt[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`slotOnCourt-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.slotOnCourt.findMany();
          if (result) {
            redisClient.setex(
              `slotOnCourt-all`,
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

  public async findUniqueSlotOnCourt({
    slotId,
    courtId,
  }: {
    slotId: string;
    courtId: string;
  }): Promise<slotOnCourt | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`slot-${slotId}-court-${courtId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.slotOnCourt.findFirst({
            where: {
              slotId,
              courtId,
            },
          });
          if (result) {
            redisClient.setex(
              `slot-${slotId}-court-${courtId}`,
              randomInt(3600, 4200),
              JSON.stringify(resolve)
            );
          }
          resolve(result);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  public async getAllCourtBySlotId(id: string): Promise<slotOnCourt[] | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`court-slot-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.slotOnCourt.findMany({
            where: {
              slotId: id,
            },
          });
          if (result) {
            redisClient.setex(
              `court-slot-${id}`,
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

  public async addManySlotOnCourt(
    slotOnCourtList: slotOnCourtData[]
  ): Promise<any> {
    return await prisma.slotOnCourt.createMany({
      data: slotOnCourtList,
    });
  }
}
