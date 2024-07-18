import { club, ClubStatus } from '@prisma/client';
import { IClubRepository } from './interface/iClub.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
import { deleteKeysByPattern } from '../util/deleteKeysByPattern';
const { instanceConnect: redisClient } = getRedis();
export class ClubRepository implements IClubRepository {
  private static Instance: ClubRepository;
  public static getInstance(): IClubRepository {
    if (!ClubRepository.Instance) {
      ClubRepository.Instance = new ClubRepository();
    }
    return ClubRepository.Instance;
  }
  public async addClub({
    courtOwnerId,
    name,
    address,
    district,
    cityOfProvince,
    logoUrl,
    description,
    preOrder,
  }: {
    courtOwnerId: string;
    name: string;
    address: string;
    district: string;
    cityOfProvince: string;
    logoUrl: string | null;
    description: string;
    preOrder: number;
  }): Promise<club> {
    const result = await prisma.club.create({
      data: {
        courtOwnerId,
        address,
        cityOfProvince,
        district,
        name,
        description,
        logoUrl,
        preOrder,
      },
    });
    redisClient?.del(`club`);
    const getAll = await prisma.club.findMany();
    redisClient?.setex(
      `club-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
    return result;
  }

  public async foundClub({ options }: { options: any }): Promise<club | null> {
    const result = await prisma.club.findFirst(options);
    return result;
  }

  public async getClubs(): Promise<club[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`club-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.club.findMany();
          if (result) {
            redisClient.setex(
              `club-all`,
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

  public async updateClub(
    clubId: string,
    data: {
      name?: string;
      address?: string;
      district?: string;
      cityOfProvince?: string;
      logoUrl?: string;
      description?: string;
      preOrder?: number;
      status?: ClubStatus;
    }
  ): Promise<club> {
    const result = await prisma.club.update({
      where: {
        id: clubId,
      },
      data,
    });

    redisClient?.del(`club-all`);
    deleteKeysByPattern(`club-location`);
    await this.getClubs();
    return result;
  }

  public async deleteClub({ id }: { id: string }): Promise<club> {
    const result = await prisma.club.update({
      where: {
        id,
      },
      data: {
        status: 'disable',
      },
    });
    redisClient?.del(`club-all`);
    deleteKeysByPattern(`club-location`);
    await this.getClubs();
    return result;
  }

  public async searchClub(data: {
    cityOfProvince?: string;
    district?: string;
    address?: string;
    name?: string;
  }): Promise<club[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`club-location-${data}`, async (err, response) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (response == null) {
          const result = await prisma.club.findMany({
            where: {
              ...data,
            },
          });
          if (result) {
            redisClient.setex(
              `club-location-${data.cityOfProvince}-${data.district}-${data.address}-${data.name}`,
              randomInt(3600, 4200),
              JSON.stringify(result)
            );
          }
          resolve(result);
        } else {
          resolve(JSON.parse(response));
        }
      });
    });
  }

  public async getClubsByOwnerId(id: string): Promise<club[]> {
    return await prisma.club.findMany({
      where: {
        courtOwnerId: id,
      },
    });
  }

  public async getClubWithSlotAndSubscription(clubId: string): Promise<any> {
    return await prisma.club.findFirst({
      where: {
        id: clubId,
      },

      //    id: string;
      // courtOwnerId: string;
      // name: string;
      // address: string;
      // district: string;
      // cityOfProvince: string;
      // logoUrl: string | null;
      // description: string | null;
      // apiKey: string;
      // status: $Enums.ClubStatus;
      // createdAt: Date;
      // updatedAt: Date;
      // preOrder: number;
      select: {
        id: true,
        courtOwnerId: true,
        name: true,
        address: true,
        district: true,
        cityOfProvince: true,
        logoUrl: true,
        description: true,
        status: true,
        preOrder: true,
        slot: true,
        subscriptionOption: true,
      },
    });
  }
}
