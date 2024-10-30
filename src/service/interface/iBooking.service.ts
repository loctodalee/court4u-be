import { booking, BookingStatus } from '@prisma/client';

export interface IBookingService {
  createBooking(data: {
    userId: string;
    billId: string;
    totalPrice: number;
    date: Date;
    status: BookingStatus;
  }): Promise<booking>;

  getAllBooking(): Promise<booking[]>;
  foundBooking(id: string): Promise<booking | null>;
  updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<booking>;
  updateBookingPrice(bookingId: string, price: number): Promise<booking>;
  deleteBooking(id: string): Promise<void>;
  getBookingByClubId(id: string): Promise<booking[]>;
}
