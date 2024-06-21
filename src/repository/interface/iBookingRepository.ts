import { booking, BookingStatus } from '@prisma/client';

export interface IBookingRepository {
  createBooking(data: {
    userId: string;
    billId: string;
    totalPrice: number;
    date: Date;
    status: BookingStatus;
  }): Promise<booking>;
  getAllBooking(): Promise<booking[]>;
  foundBooking(id: string): Promise<booking | null>;
}
