import { BookingStatus, booking } from '@prisma/client';
import { IBookingRepository } from './interface/iBookingRepository';
import prisma from '../lib/prisma';

export class BookingRepository implements IBookingRepository {
  private static Instance: BookingRepository;
  public static getInstance(): BookingRepository {
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
    return await prisma.booking.create({
      data,
    });
  }

  public async getAllBooking(): Promise<booking[]> {
    return await prisma.booking.findMany();
  }

  public async foundBooking(id: string): Promise<booking | null> {
    return await prisma.booking.findFirst({
      where: {
        id,
      },
    });
  }
}
