import { BookingStatus, booking } from '@prisma/client';
import { IBookingSerivce } from './interface/iBooking.service';
import { IBookingRepository } from '../repository/interface/iBookingRepository';
import { BookingRepository } from '../repository/booking.repository';

export class BookingService implements IBookingSerivce {
  private static Instance: BookingService;
  public static getInstance(): BookingService {
    if (!this.Instance) {
      this.Instance = new BookingService();
    }
    return this.Instance;
  }
  private static _bookingRepository: IBookingRepository =
    BookingRepository.getInstance();
  constructor() {}
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
}
