import { PrismaClient, clubImage } from '@prisma/client';
import { List } from 'lodash';
import { IClubImageRepository } from './interface/iClubImage.repository';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
const { instanceConnect: redisClient } = getRedis();

const prisma = new PrismaClient();

export class ClubImageRepository implements IClubImageRepository {
  private static instance: ClubImageRepository;

  public static getInstance(): IClubImageRepository {
    if (!ClubImageRepository.instance) {
      ClubImageRepository.instance = new ClubImageRepository();
    }
    return ClubImageRepository.instance;
  }

  public async getClubImageById(id: string): Promise<clubImage | null> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`clubImage-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.clubImage.findUnique({ where: { id } });
          if (result) {
            redisClient?.setex(
              `clubImage-${id}`,
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

  public async getAllClubImages(): Promise<List<clubImage>> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`clubImage-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.clubImage.findMany();
          if (result) {
            redisClient?.setex(
              `clubImage-all`,
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

  public async createClubImage(data: {
    clubId: string;
    name: string;
    url: string;
  }): Promise<clubImage> {
    const result = await prisma.clubImage.create({ data });
    redisClient?.del(`clubImage-all`);
    await this.getAllClubImages();
    return result;
  }

  public async updateClubImage(
    id: string,
    data: {
      clubId?: string;
      name?: string;
      url?: string;
    }
  ): Promise<clubImage | null> {
    const result = await prisma.clubImage.update({
      where: { id },
      data,
    });
    redisClient?.del(`clubImage-${id}`);
    redisClient?.setex(
      `clubImage-${id}`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
    redisClient?.del(`clubImage-all`);
    await this.getAllClubImages();
    return result;
  }

  public async deleteClubImage(id: string): Promise<clubImage | null> {
    const result = await prisma.clubImage.delete({ where: { id } });
    redisClient?.del(`clubImage-all`);
    redisClient?.del(`clubImage-${id}`);
    await this.getAllClubImages();
    return result;
  }
}
