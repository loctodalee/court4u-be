import { BookingStatus, booking } from '@prisma/client';
import { IBookingRepository } from './interface/iBookingRepository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { BillRepository } from './bill.repository';
import { randomInt } from 'crypto';
import redis from 'redis';
import { deleteKeysByPattern } from '../util/deleteKeysByPattern';
const { instanceConnect: redisClient } = getRedis();

export class BookingRepository implements IBookingRepository {
  private static Instance: BookingRepository;
  public static getInstance(): IBookingRepository {
    if (!this.Instance) {
      this.Instance = new BookingRepository();
    }
    return this.Instance;
  }

  public async createBooking(data: {
    userId: string;
    billId: string;
    totalPrice: number;
    date: Date;
    status: BookingStatus;
  }): Promise<booking> {
    const result = await prisma.booking.create({
      data,
    });

    return result;
  }

  public async getAllBooking(): Promise<booking[]> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`booking-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.booking.findMany();
          if (!result) {
            redisClient!.setex(
              `booking-all`,
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

  public async foundBooking(id: string): Promise<booking | null> {
    return new Promise((resolve, reject) => {
      redisClient!.get(`booking-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.booking.findFirst({
            where: {
              id,
            },
          });

          if (!result) {
            redisClient!.setex(
              `booking-${id}`,
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

  public async updateBooking(
    bookingId: string,
    data: {
      status?: BookingStatus;
      totalPrice?: number;
    }
  ): Promise<booking> {
    const result = await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data,
    });
    redisClient?.del(`booking-${bookingId}`);
    redisClient?.setex(
      `booking-${bookingId}`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
    return result;
  }

  public async deleteBooking(id: string): Promise<void> {
    await prisma.booking.delete({
      where: {
        id,
      },
    });

    redisClient?.del(`booking-${id}`);
    redisClient?.del(`bookedSlot-booking-${id}`);
    redisClient?.del(`booking-all`);
    deleteKeysByPattern(`booking`);
    const getAll = await prisma.booking.findMany();
    redisClient?.setex(
      `booking-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );
  }

  public async getBookingsByClubId(id: string): Promise<booking[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`booking-club-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.booking.findMany({
            where: {
              bookedSlot: {
                some: {
                  slot: {
                    clubId: id,
                  },
                },
              },
            },
            include: {
              bookedSlot: {
                include: {
                  slot: true,
                },
              },
              user: true,
            },
          });
          if (result) {
            redisClient.setex(
              `booking-club-${id}`,
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
