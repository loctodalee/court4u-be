import { $Enums, court, CourtStatus } from '@prisma/client';
import { ICourtRepository } from './interface/iCourt.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
const { instanceConnect: redisClient } = getRedis();

export class CourtRepository implements ICourtRepository {
  private static Instance: CourtRepository;
  public static getInstance(): ICourtRepository {
    if (!CourtRepository.Instance) {
      this.Instance = new CourtRepository();
    }
    return this.Instance;
  }
  public async createCourt({
    clubId,
    status,
    number,
  }: {
    clubId: string;
    status: CourtStatus;
    number: number;
  }): Promise<court> {
    const result = await prisma.court.create({
      data: {
        clubId,
        status,
        number,
      },
    });
    const getByClub = await prisma.court.findMany({
      where: {
        clubId,
      },
    });
    redisClient?.del(`court-club-${clubId}`);
    redisClient?.setex(
      `court-club-${clubId}`,
      randomInt(3600, 4200),
      JSON.stringify(getByClub)
    );

    return result;
  }

  public async getAllCourtByClubId(id: string): Promise<court[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`court-club-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.court.findMany({
            where: {
              clubId: id,
            },
          });
          if (result) {
            redisClient.setex(
              `court-club-${id}`,
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

  public async getCourtBySlotId(slotId: string): Promise<court[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`court-slot-${slotId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.court.findMany({
            where: {
              slotOnCourt: {
                some: {
                  slotId,
                },
              },
            },
          });
          if (result) {
            redisClient.setex(
              `court-slot-${slotId}`,
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

  public async findExistedCourt(
    clubId: string,
    number: number
  ): Promise<court | null> {
    return await prisma.court.findFirst({
      where: {
        AND: [
          {
            clubId,
          },
          {
            number,
          },
        ],
      },
    });
  }
}
