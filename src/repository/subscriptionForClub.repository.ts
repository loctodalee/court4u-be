import {
  $Enums,
  SubcriptionForClubStatus,
  SubsciptionForClubType,
  subscriptionForClub,
} from '@prisma/client';
import { ISubscriptionForClubRepository } from './interface/iSubscriptionForClub.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
const { instanceConnect: redisClient } = getRedis();

export class SubscriptionForClubRepository
  implements ISubscriptionForClubRepository
{
  private static Instance: SubscriptionForClubRepository;
  public static getInstance(): ISubscriptionForClubRepository {
    if (!this.Instance) {
      this.Instance = new SubscriptionForClubRepository();
    }
    return this.Instance;
  }

  public async getAll(): Promise<subscriptionForClub[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`subsForClub-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.subscriptionForClub.findMany();
          if (result) {
            redisClient.setex(
              `subsForClub-all`,
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

  public async searchById(id: string): Promise<subscriptionForClub | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`subsForClub-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.subscriptionForClub.findFirst({
            where: {
              id,
            },
          });
          if (result) {
            redisClient.setex(
              `subsForClub-${id}`,
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
  public async createNewSubscription(data: {
    name: string;
    price: number;
    totalDate: number;
    type: SubsciptionForClubType;
    status: SubcriptionForClubStatus;
  }): Promise<subscriptionForClub> {
    const result = await prisma.subscriptionForClub.create({
      data,
    });
    redisClient?.del(`subsForClub-all`);
    const getAll = await prisma.subscriptionForClub.findMany();
    redisClient?.setex(
      `subsForClub-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    return result;
  }

  public async updateSubscription(
    id: string,
    data: {
      name?: string | undefined;
      price?: number | undefined;
      totalDate?: number | undefined;
      type?: SubsciptionForClubType | undefined;
      status?: SubcriptionForClubStatus | undefined;
    }
  ): Promise<subscriptionForClub> {
    const result = await prisma.subscriptionForClub.update({
      where: {
        id,
      },
      data,
    });
    redisClient?.del(`subsForClub-all`);
    const getAll = await prisma.subscriptionForClub.findMany();
    redisClient?.setex(
      `subsForClub-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    redisClient?.del(`subsForClub-${id}`);
    redisClient?.setex(
      `subsForClub-${id}`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
    return result;
  }
}
