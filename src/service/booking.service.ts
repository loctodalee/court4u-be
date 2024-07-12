import { BookingStatus, booking } from '@prisma/client';
import { IBookingService } from './interface/iBooking.service';
import { IBookingRepository } from '../repository/interface/iBookingRepository';
import { BookingRepository } from '../repository/booking.repository';

export class BookingService implements IBookingService {
  private static Instance: BookingService;
  public static getInstance(): IBookingService {
    if (!this.Instance) {
      this.Instance = new BookingService();
    }
    return this.Instance;
  }
  private static _bookingRepository: IBookingRepository =
    BookingRepository.getInstance();
  public async createBooking(data: {
    userId: string;
    billId: string;
    totalPrice: number;
    date: Date;
    status: BookingStatus;
  }): Promise<booking> {
    return await BookingService._bookingRepository.createBooking(data);
  }

  public async getAllBooking(): Promise<booking[]> {
    return await BookingService._bookingRepository.getAllBooking();
  }

  public async foundBooking(id: string): Promise<booking | null> {
    return await BookingService._bookingRepository.foundBooking(id);
  }

  public async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<booking> {
    return await BookingService._bookingRepository.updateBooking(bookingId, {
      status,
    });
  }

  public async updateBookingPrice(
    bookingId: string,
    price: number
  ): Promise<booking> {
    return await BookingService._bookingRepository.updateBooking(bookingId, {
      totalPrice: price,
    });
  }
  public async deleteBooking(id: string): Promise<void> {
    await BookingService._bookingRepository.deleteBooking(id);
  }
  public async getBookingByClubId(id: string): Promise<booking[]> {
    return await BookingService._bookingRepository.getBookingsByClubId(id);
  }
}
