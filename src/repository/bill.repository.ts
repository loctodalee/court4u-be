import {
  BillStatus,
  BillType,
  PrismaClient,
  bill,
  slot,
  memberSubscription,
} from '@prisma/client';
import { List } from 'lodash';
import { IBillRepository } from './interface/iBill.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { BadRequestError } from '../handleResponse/error.response';
import { randomInt } from 'crypto';
const { instanceConnect: redisClient } = getRedis();

export class BillRepository implements IBillRepository {
  private static instance: BillRepository;

  public static getInstance(): IBillRepository {
    if (!BillRepository.instance) {
      BillRepository.instance = new BillRepository();
    }
    return BillRepository.instance;
  }

  public async getBillById(id: string): Promise<bill | null> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`bill-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        if (data == null) {
          const result = await prisma.bill.findUnique({ where: { id } });
          if (result) {
            redisClient!.setex(
              `bill-${id}`,
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

  public async getAllBills(): Promise<bill[]> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`bill-all`, async (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data == null) {
          const result = await prisma.bill.findMany();
          if (result) {
            redisClient!.setex(
              `bill-all`,
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

  public async createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    status: BillStatus;
  }): Promise<bill> {
    const result = await prisma.bill.create({ data });

    redisClient!.del(`bill-all`);
    const getAll = await prisma.bill.findMany();
    redisClient!.setex(
      `bill-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    return result;
  }

  public async updateBill(
    id: string,
    data: {
      method?: string;
      total?: number;
      date?: Date;
      type?: BillType;
      status?: BillStatus;
    }
  ): Promise<bill | null> {
    const result = prisma.bill.update({
      where: { id },
      data,
    });
    redisClient!.del(`bill-${id}`);
    redisClient!.setex(
      `bill-${id}`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
    return result;
  }

  public async deleteBill(id: string): Promise<bill | null> {
    const result = await prisma.bill.delete({ where: { id } });
    redisClient!.del(`bill-${id}`);
    redisClient!.del(`bill-all`);
    const getAll = await prisma.bill.findMany();
    redisClient!.setex(
      `bill-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    return result;
  }

  public async getBillsByClubId(clubId: string): Promise<bill[]> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`bill-club-${clubId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const bills = await prisma.bill.findMany({
            where: {
              OR: [
                {
                  clubSubscription: {
                    clubId,
                  },
                },
                {
                  memberSubscription: {
                    subscriptionOption: {
                      clubId,
                    },
                  },
                },
                {
                  booking: {
                    bookedSlot: {
                      some: {
                        slot: {
                          clubId,
                        },
                      },
                    },
                  },
                },
              ],
            },
          });
          if (bills) {
            redisClient!.setex(
              `bill-club-${clubId}`,
              randomInt(3600, 4200),
              JSON.stringify(bills)
            );
          }
          resolve(bills);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  public async getBillByOwnerId(id: string): Promise<bill[]> {
    return await prisma.bill.findMany({
      where: {
        OR: [
          {
            clubSubscription: {
              club: {
                courtOwnerId: id,
              },
            },
          },
          {
            memberSubscription: {
              subscriptionOption: {
                club: {
                  courtOwnerId: id,
                },
              },
            },
          },
          {
            booking: {
              bookedSlot: {
                some: {
                  slot: {
                    club: {
                      courtOwnerId: id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
    });
  }

  public async getBillIdFullInfo(id: string): Promise<any> {
    const result = await prisma.bill.findFirst({
      where: {
        id,
      },
      include: {
        booking: {
          include: {
            user: {
              select: {
                email: true,
                fullname: true,
                dateOfBirth: true,
                id: true,
                phone: true,
                avatarUrl: true,
              },
            },
            bookedSlot: {
              include: {
                slot: true,
              },
            },
          },
        },
        clubSubscription: {
          include: {
            club: {
              include: {
                user: {
                  select: {
                    email: true,
                    fullname: true,
                    dateOfBirth: true,
                    id: true,
                    phone: true,
                    avatarUrl: true,
                  },
                },
              },
            },
            SubscriptionForClub: true,
          },
        },
        memberSubscription: {
          include: {
            subscriptionOption: true,
            user: {
              select: {
                email: true,
                fullname: true,
                dateOfBirth: true,
                id: true,
                phone: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
    return result;
  }
}
