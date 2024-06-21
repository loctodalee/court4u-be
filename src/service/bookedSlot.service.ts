import { bookedSlot, booking, Prisma } from '@prisma/client';
import { bookSlot, IBookedSlotService } from './interface/iBookedSlot.service';
import prisma from '../lib/prisma';
import { forEach } from 'lodash';
import { ISlotRepository } from '../repository/interface/iSlot.repository';
import { SlotRepository } from '../repository/slot.repository';
import { IBookingSerivce } from './interface/iBooking.service';
import { BookingService } from './booking.service';
import { IBillService } from './interface/iBill.service';
import { BillService } from './bill.service';
import { IBookedSlotRepository } from '../repository/interface/iBookedSlot.repository';
import { BookedSlotRepository } from '../repository/bookedSlot.repository';

export type bookSlotInfo = {
  date: Date;
  slotId: string;
  bookingId: string;
  checkedIn: string;
  price: number;
};
export class BookedSlotService implements IBookedSlotService {
  private _slotRepository: ISlotRepository;
  private _bookingService: IBookingSerivce;
  private _billService: IBillService;
  private _bookedSlotRepository: IBookedSlotRepository;
  constructor() {
    this._slotRepository = SlotRepository.getInstance();
    this._bookedSlotRepository = BookedSlotRepository.getInstance();
    this._bookingService = new BookingService();
    this._billService = new BillService();
  }

  public async createBookedSlot({
    userId,
    slotList,
  }: {
    userId: string;
    slotList: bookSlot[];
  }): Promise<Prisma.BatchPayload> {
    const slotIds = slotList.map((entry) => entry.slotId);
    const slots = await this._slotRepository.findManySlot({
      options: {
        where: {
          id: { in: slotIds },
        },
        select: { id: true, price: true },
      },
    });
    var bookedSlotInfoList: bookSlotInfo[] = [];

    slots.forEach((slot) => {
      slotList.forEach((data) => {
        if (slot.id === data.slotId) {
          bookedSlotInfoList.push({
            checkedIn: 'false',
            date: new Date(Date.now()),
            price: slot.price,
            bookingId: '0',
            slotId: data.slotId,
          });
        }
      });
    });
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);
    console.log(totalPrice);
    const bill = await this._billService.createBill({
      date: new Date(Date.now()),
      method: 'momo',
      status: 'pending',
      total: totalPrice,
      type: 'booking',
    });
    const booking = await this._bookingService.createBooking({
      userId,
      billId: bill.id,
      date: new Date(Date.now()),
      totalPrice: totalPrice,
      status: 'pending',
    });

    bookedSlotInfoList.forEach((item) => {
      item.bookingId = booking.id;
    });

    return await this._bookedSlotRepository.createBookedSlot(
      bookedSlotInfoList
    );
  }

  public async getAllBookedSlot(): Promise<bookedSlot[]> {
    return await this._bookedSlotRepository.getAllBookedSlot();
  }

  public async foundBookedSlot(id: string): Promise<bookedSlot | null> {
    return await this._bookedSlotRepository.foundBookedSlot(id);
  }
}
