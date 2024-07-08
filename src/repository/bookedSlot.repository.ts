import { bookedSlot, checkInStatus, Prisma } from '@prisma/client';
import { IBookedSlotRepository } from './interface/iBookedSlot.repository';
import prisma from '../lib/prisma';

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
    return await prisma.bookedSlot.createMany({
      data,
    });
  }

  public async getAllBookedSlot(): Promise<bookedSlot[]> {
    return await prisma.bookedSlot.findMany();
  }

  public async findBookedSlot(id: string): Promise<bookedSlot | null> {
    return await prisma.bookedSlot.findFirst({
      where: {
        id,
      },
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
  }

  public async getSlotByBookingId(bookingId: string): Promise<bookedSlot[]> {
    return await prisma.bookedSlot.findMany({
      where: {
        bookingId,
      },
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
}
