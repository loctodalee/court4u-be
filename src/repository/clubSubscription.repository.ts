import { $Enums, clubSubscription } from '@prisma/client';
import { IClubSubscriptionRepository } from './interface/iClubSubscription.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
const { instanceConnect: redisClient } = getRedis();

export class ClubSubscriptionRepository implements IClubSubscriptionRepository {
  private static Instance: ClubSubscriptionRepository;
  public static getInstance(): IClubSubscriptionRepository {
    if (!this.Instance) {
      this.Instance = new ClubSubscriptionRepository();
    }
    return this.Instance;
  }

  public async createClubSubscription(data: {
    clubId: string;
    subscriptionForClubId: string;
    billId: string;
    name: string;
    price: number;
    totalDate: number;
    startDate: Date;
    endDate: Date;
    status: $Enums.clubSubscriptionStatus;
  }): Promise<clubSubscription> {
    const result = await prisma.clubSubscription.create({
      data,
    });
    redisClient?.del(`clubSubscription-all`);
    const getAll = await prisma.clubSubscription.findMany();
    redisClient?.setex(
      `clubSubscription-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    return result;
  }

  public async updateClubSubs(
    id: string,
    data: {
      clubId?: string | undefined;
      subscriptionForClubId?: string | undefined;
      name?: string | undefined;
      price?: number | undefined;
      totalDate?: number | undefined;
      startDate?: Date | undefined;
      endDate?: Date | undefined;
      status?: $Enums.clubSubscriptionStatus | undefined;
    }
  ): Promise<clubSubscription> {
    const result = await prisma.clubSubscription.update({
      where: {
        id,
      },
      data,
    });
    redisClient?.del(`clubSubscription-all`);
    redisClient?.del(`clubSubscription-${id}`);
    redisClient?.del(`clubSubscription-club-${result.clubId}`);

    const getAll = await prisma.clubSubscription.findMany();
    redisClient?.setex(
      `clubSubscription-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    redisClient?.setex(
      `clubSubscription-${id}`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
    redisClient?.setex(
      `clubSubscription-club-${result.clubId}`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
    return result;
  }

  public async foundClubSubById(id: string): Promise<clubSubscription | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`clubSubscription-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.clubSubscription.findFirst({
            where: {
              id,
            },
          });
          if (result) {
            redisClient.setex(
              `clubSubscription-${id}`,
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

  public async foundClubsubByClubId(
    id: string
  ): Promise<clubSubscription | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`clubSubscription-club-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.clubSubscription.findFirst({
            where: {
              clubId: id,
            },
          });
          if (result) {
            redisClient.setex(
              `clubSubscription-club-${id}`,
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

  public async getAll(): Promise<clubSubscription[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`clubSubscription-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.clubSubscription.findMany();
          if (result) {
            redisClient.setex(
              `clubSubscription-all`,
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
