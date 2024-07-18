import {
  $Enums,
  club,
  memberSubscription,
  Prisma,
  subscriptionOption,
} from '@prisma/client';
import { IMemberSubscriptionRepository } from './interface/iMemberSubscription.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
import { deleteKeysByPattern } from '../util/deleteKeysByPattern';
const { instanceConnect: redisClient } = getRedis();

export class MemberSubscriptionRepository
  implements IMemberSubscriptionRepository
{
  private static Instance: MemberSubscriptionRepository;
  public static getInstance(): IMemberSubscriptionRepository {
    if (!this.Instance) {
      this.Instance = new MemberSubscriptionRepository();
    }
    return this.Instance;
  }
  public async createMemberSubscription({
    memberId,
    subscriptionId,
    billId,
    startDate,
    endDate,
    timeRemain,
    usesHistory,
  }: {
    memberId: string;
    subscriptionId: string;
    billId: string;
    startDate: Date;
    endDate: Date;
    timeRemain?: number;
    usesHistory?: [];
  }): Promise<memberSubscription> {
    const result = await prisma.memberSubscription.create({
      data: {
        billId,
        subscriptionId,
        memberId,
        status: 'pending',
        timeRemain,
        usesHistory,
        startDate,
        endDate,
      },
    });
    redisClient?.del(`memberSubs-subsOption-${result.subscriptionId}`);
    await this.findBySubscriptionId(result.subscriptionId);
    redisClient?.del(`memberSubs-all`);
    const getAll = await prisma.memberSubscription.findMany();
    redisClient?.setex(
      `memberSubs-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    deleteKeysByPattern(`memberSubs-club`);
    redisClient?.del(`memberSubs-user-${result.memberId}`);
    const memberSubsByUser = await prisma.memberSubscription.findMany({
      where: {
        memberId: result.memberId,
      },
    });
    redisClient?.setex(
      `memberSubs-user-${result.memberId}`,
      randomInt(3600, 4200),
      JSON.stringify(memberSubsByUser)
    );
    return result;
  }

  public async foundMemberSubscription({
    options,
  }: {
    options: any;
  }): Promise<memberSubscription | null> {
    return await prisma.memberSubscription.findFirst(options);
  }

  public async updateMemberSubscription({
    options,
  }: {
    options: any;
  }): Promise<memberSubscription> {
    const result = await prisma.memberSubscription.update(options);
    redisClient?.del(`memberSubs-subsOption-${result.subscriptionId}`);
    await this.findBySubscriptionId(result.subscriptionId);
    redisClient?.del(`memberSubs-all`);
    const getAll = await prisma.memberSubscription.findMany();
    redisClient?.setex(
      `memberSubs-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    deleteKeysByPattern(`memberSubs-club`);
    redisClient?.del(`memberSubs-user-${result.memberId}`);
    const memberSubsByUser = await prisma.memberSubscription.findMany({
      where: {
        memberId: result.memberId,
      },
    });
    redisClient?.setex(
      `memberSubs-user-${result.memberId}`,
      randomInt(3600, 4200),
      JSON.stringify(memberSubsByUser)
    );
    return result;
  }

  public async findBySubscriptionId(id: string): Promise<memberSubscription[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`memberSubs-subsOption-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.memberSubscription.findMany({
            where: {
              subscriptionId: id,
            },
          });
          if (result) {
            redisClient.setex(
              `memberSubs-subsOption-${id}`,
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

  public async getAll(): Promise<memberSubscription[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`memberSubs-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.memberSubscription.findMany();
          if (result) {
            redisClient.setex(
              `memberSubs-all`,
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

  public async getByClubId(clubId: string): Promise<memberSubscription[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`memberSubs-club-${clubId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.memberSubscription.findMany({
            where: {
              subscriptionOption: {
                clubId,
              },
            },
          });

          if (result) {
            redisClient.setex(
              `memberSubs-club-${clubId}`,
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

  public async getByUserId(userId: string): Promise<memberSubscription[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`memberSubs-user-${userId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.memberSubscription.findMany({
            where: {
              memberId: userId,
            },
          });
          if (result) {
            redisClient.setex(
              `memberSubs-user-${userId}`,
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

  public async findExisted({
    clubId,
    userId,
  }: {
    clubId: string;
    userId: string;
  }): Promise<memberSubscription | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(
        `memberSubs-club-${clubId}-user-${userId}`,
        async (err, data) => {
          if (err) {
            reject(err);
            throw err;
          }
          if (data == null) {
            const result = await prisma.memberSubscription.findFirst({
              where: {
                memberId: userId,
                subscriptionOption: {
                  clubId,
                },
              },
            });
            if (result) {
              redisClient.setex(
                `memberSubs-club-${clubId}-user-${userId}`,
                randomInt(3600, 4200),
                JSON.stringify(result)
              );
            }
            resolve(result);
          } else {
            resolve(JSON.parse(data));
          }
        }
      );
    });
  }
}
