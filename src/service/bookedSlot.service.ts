import { bookedSlot, booking, Prisma } from '@prisma/client';
import { IBookedSlotService } from './interface/iBookedSlot.service';
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
  public async createBookedSlot(
    userId: string,
    datas: {
      date: Date;
      slotId: string;
      checkedIn: string;
      price: number;
      bookingId: string;
    }[]
  ): Promise<Prisma.BatchPayload> {
    const slotIds = datas.map((entry) => entry.slotId);
    const slots = await this._slotRepository.findManySlot({
      options: {
        where: {
          id: { in: slotIds },
        },
        select: { id: true, price: true },
      },
    });
    slots.forEach((slot) => {
      datas.forEach((data) => {
        if (slot.id === data.slotId) {
          data.price = slot.price;
        }
      });
    });
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);
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
      status: 'pending',
    });
    datas.forEach((item) => {
      item.bookingId = booking.id;
    });

    return await this._bookedSlotRepository.createBookedSlot(datas);
  }

  public async getAllBookedSlot(): Promise<bookedSlot[]> {
    return await this._bookedSlotRepository.getAllBookedSlot();
  }

  public async foundBookedSlot(id: string): Promise<bookedSlot | null> {
    return await this._bookedSlotRepository.foundBookedSlot(id);
  }
}
