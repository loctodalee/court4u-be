import { bookedSlot, checkInStatus, Prisma } from '@prisma/client';
import { IBookedSlotRepository } from './interface/iBookedSlot.repository';
import prisma from '../lib/prisma';
import { getRedis } from '../lib/init.redis';
import { randomInt } from 'crypto';
import { BillRepository } from './bill.repository';
import { deleteKeysByPattern } from '../util/deleteKeysByPattern';
const { instanceConnect: redisClient } = getRedis();
export class BookedSlotRepository implements IBookedSlotRepository {
  private static Instance: BookedSlotRepository;
  public static getInstance(): IBookedSlotRepository {
    if (!this.Instance) {
      this.Instance = new BookedSlotRepository();
    }
    return this.Instance;
  }

  public async createBookedSlot(
    data: {
      bookingId: string;
      date: Date;
      slotId: string;
      checkedIn: checkInStatus;
      price: number;
    }[]
  ): Promise<Prisma.BatchPayload> {
    const result = await prisma.bookedSlot.createMany({
      data,
    });
    let clubId = null;
    const bookedSlot = await prisma.bookedSlot.findFirst({
      where: {
        bookingId: data[0].bookingId,
      },
      include: {
        slot: true,
      },
    });
    clubId = bookedSlot?.slot.clubId;
    redisClient!.del(`bill-club-${clubId}`);
    if (clubId != null) {
      const clubBill = await BillRepository.getInstance().getBillsByClubId(
        clubId
      );
      redisClient!.setex(
        `bill-club-${clubId}`,
        randomInt(3600, 4200),
        JSON.stringify(clubBill)
      );

      redisClient?.del(`bookedSlot-club-${clubId}`);
      const bookedSlotByClub = await this.getBookedSlotByClubId(clubId!);
      redisClient?.setex(
        `bookedSlot-club-${clubId}`,
        randomInt(3600, 4200),
        JSON.stringify(bookedSlotByClub)
      );
    }
    const getAll = await prisma.bookedSlot.findMany();
    redisClient?.del(`bookedSlot-all`);
    redisClient?.setex(
      `bookedSlot-all`,
      randomInt(3600, 4200),
      JSON.stringify(getAll)
    );

    return result;
  }

  public async getAllBookedSlot(): Promise<bookedSlot[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`bookedSlot-all`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.bookedSlot.findMany();
          if (result) {
            redisClient.setex(
              `bookedSlot-all`,
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

  public async findBookedSlot(id: string): Promise<bookedSlot | null> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`bookedSlot-${id}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.bookedSlot.findFirst({
            where: {
              id,
            },
          });
          if (result == null) {
            redisClient.setex(
              `bookedSlot-${id}`,
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

  public async findBookedSlotByDateAndSlotId({
    date,
    slotId,
  }: {
    date: Date;
    slotId: string;
  }): Promise<bookedSlot[]> {
    const targetDate = new Date(date);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate() + 1;

    return await prisma.bookedSlot.findMany({
      where: {
        AND: [
          {
            date: {
              equals: new Date(year, month - 1, day),
            },
          },
          {
            slotId,
          },
        ],
      },
    });
  }

  public async deleteManyBookedSlot(bookingId: string): Promise<void> {
    await prisma.bookedSlot.deleteMany({
      where: {
        bookingId: bookingId,
      },
    });
    deleteKeysByPattern(`bookedSlot`);
    const result = await prisma.bookedSlot.findMany();
    redisClient?.setex(
      `bookedSlot-all`,
      randomInt(3600, 4200),
      JSON.stringify(result)
    );
  }

  public async getSlotByBookingId(bookingId: string): Promise<bookedSlot[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`bookedSlot-booking-${bookingId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.bookedSlot.findMany({
            where: {
              bookingId,
            },
          });
          if (result) {
            redisClient.setex(
              `bookedSlot-booking-${bookingId}`,
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

  public async updateCheckIn({
    bookedSlotId,
    checkIn,
  }: {
    bookedSlotId: string;
    checkIn: checkInStatus;
  }): Promise<bookedSlot> {
    return await prisma.bookedSlot.update({
      where: {
        id: bookedSlotId,
      },
      data: {
        checkedIn: checkIn,
      },
    });
  }

  public async getBookedSlotByClubId(clubId: string): Promise<bookedSlot[]> {
    return new Promise((resolve, reject) => {
      redisClient?.get(`bookedSlot-club-${clubId}`, async (err, data) => {
        if (err) {
          reject(err);
          throw err;
        }
        if (data == null) {
          const result = await prisma.bookedSlot.findMany({
            where: {
              slot: {
                clubId,
              },
            },
          });
          if (result) {
            redisClient.setex(
              `bookedSlot-club-${clubId}`,
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
