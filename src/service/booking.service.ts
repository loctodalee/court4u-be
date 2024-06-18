import { BookingStatus, booking } from '@prisma/client';
import { IBookingSerivce } from './interface/iBooking.service';
import { IBookingRepository } from '../repository/interface/iBookingRepository';
import { BookingRepository } from '../repository/booking.repository';

export class BookingService implements IBookingSerivce {
  private _bookingRepository: IBookingRepository;
  constructor() {
    this._bookingRepository = BookingRepository.getInstance();
  }
  public async createBooking(data: {
    userId: string;
    billId: string;
    date: Date;
    status: BookingStatus;
  }): Promise<booking> {
    return await this._bookingRepository.createBooking(data);
  }

  public async getAllBooking(): Promise<booking[]> {
    return await this._bookingRepository.getAllBooking();
  }

  public async foundBooking(id: string): Promise<booking | null> {
    return await this._bookingRepository.foundBooking(id);
  }
}
