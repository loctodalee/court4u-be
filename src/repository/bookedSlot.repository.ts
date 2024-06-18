import { bookedSlot, Prisma } from '@prisma/client';
import { IBookedSlotRepository } from './interface/iBookedSlot.repository';
import prisma from '../lib/prisma';

export class BookedSlotRepository implements IBookedSlotRepository {
  private static Instance: BookedSlotRepository;
  public static getInstance(): BookedSlotRepository {
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
      checkedIn: string;
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

  public async foundBookedSlot(id: string): Promise<bookedSlot | null> {
    return await prisma.bookedSlot.findFirst({
      where: {
        id,
      },
    });
  }
}
