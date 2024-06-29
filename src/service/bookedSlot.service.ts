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
import { IMemberSubscriptionService } from './interface/iMemberSubscription.service';
import { MemberSubscriptionService } from './memberSubscription.service';
import { NotFoundError } from '../handleResponse/error.response';
import { ISubscriptionService } from './interface/iSubscription.service';
import { SubscriptionFactory } from './subscription.service';

export type bookSlotInfo = {
  date: Date;
  slotId: string;
  bookingId: string;
  checkedIn: string;
  price: number;
};
export class BookedSlotService implements IBookedSlotService {
  private static Instance: BookedSlotService;
  public static getInstance(): BookedSlotService {
    if (!this.Instance) {
      this.Instance = new BookedSlotService();
    }
    return this.Instance;
  }
  private static _subscriptionService: ISubscriptionService;
  private static _slotRepository: ISlotRepository;
  private static _bookingService: IBookingSerivce;
  private static _billService: IBillService;
  private static _bookedSlotRepository: IBookedSlotRepository;
  private static _memberSubscriptionService: IMemberSubscriptionService;
  static {
    this._memberSubscriptionService = MemberSubscriptionService.getInstance();
    this._bookedSlotRepository = BookedSlotRepository.getInstance();
    this._billService = BillService.getInstance();
    this._bookingService = BookingService.getInstance();
    this._slotRepository = SlotRepository.getInstance();
    this._subscriptionService = SubscriptionFactory.getInstance();
  }

  public async createBookedSlot({
    userId,
    subscriptionId,
    slotList,
  }: {
    userId: string;
    subscriptionId: string;
    slotList: bookSlot[];
  }): Promise<Prisma.BatchPayload> {
    // sort để lấy toàn bộ id trong list slotList nhận tự request
    const slotIds = slotList.map((entry) => entry.slotId);

    // sort để lấy ra price của từng slot trong slotList
    const slots = await BookedSlotService._slotRepository.findManySlot({
      options: {
        where: {
          id: { in: slotIds },
        },
      },
    });
    //tạo ra nơi để lưu lại full thông tin của 1 bookedSlot
    var bookedSlotInfoList: bookSlotInfo[] = [];

    // sort để gán giá của vào từng slot và push vào bookedSlotInfoList
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

    // tính total price để tạo bill
    const totalPrice = slots.reduce((sum, slot) => sum + slot.price, 0);
    const totalTime = slots.reduce(
      (sum, slot) => sum + (slot.endTime.getTime() - slot.endTime.getTime()),
      0
    );
    console.log(totalPrice);
    if (!subscriptionId) {
      // nếu không có sử dụng gói để book slot
      const bill = await BookedSlotService._billService.createBill({
        date: new Date(Date.now()),
        method: 'momo',
        status: 'pending',
        total: totalPrice,
        type: 'booking',
      });
      const booking = await BookedSlotService._bookingService.createBooking({
        userId,
        billId: bill.id,
        date: new Date(Date.now()),
        totalPrice: totalPrice,
        status: 'pending',
      });

      // redirect qua payment

      bookedSlotInfoList.forEach((item) => {
        item.bookingId = booking.id;
      });
    } else {
      // có sử dụng subscription để book slot
      // kiểm tra coi subscription có tồn tại không
      const memberSubs =
        await BookedSlotService._memberSubscriptionService.searchSubscription(
          subscriptionId
        );
      if (!memberSubs) throw new NotFoundError('Not found subscription');
      const memberSubsType = await BookedSlotService._subscriptionService
        .findSubscriptionById({
          keySearch: memberSubs.subscriptionId,
        })
        .then((x) => x?.type);
      const bill = await BookedSlotService._billService.createBill({
        date: new Date(Date.now()),
        method: 'subscription',
        status: 'success',
        total: totalPrice,
        type: 'booking',
      });
      const booking = await BookedSlotService._bookingService.createBooking({
        userId,
        billId: bill.id,
        date: new Date(Date.now()),
        totalPrice: totalPrice,
        status: 'active',
      });
      switch (memberSubsType) {
        case 'Month': {
          await BookedSlotService._memberSubscriptionService.updateMonthSubscription(
            memberSubs.id
          );
          break;
        }

        case 'Time': {
          await BookedSlotService._memberSubscriptionService.updateTimeSubscription(
            memberSubs.id,
            totalTime
          );
        }
      }
      bookedSlotInfoList.forEach((item) => {
        item.bookingId = booking.id;
      });
    }

    return await BookedSlotService._bookedSlotRepository.createBookedSlot(
      bookedSlotInfoList
    );
  }

  public async getAllBookedSlot(): Promise<bookedSlot[]> {
    return await BookedSlotService._bookedSlotRepository.getAllBookedSlot();
  }

  public async foundBookedSlot(id: string): Promise<bookedSlot | null> {
    return await BookedSlotService._bookedSlotRepository.foundBookedSlot(id);
  }
}
