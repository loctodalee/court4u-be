import { bookedSlot, booking, checkInStatus, Prisma } from '@prisma/client';
import { bookSlot, IBookedSlotService } from './interface/iBookedSlot.service';
import prisma from '../lib/prisma';
import { forEach } from 'lodash';
import { ISlotRepository } from '../repository/interface/iSlot.repository';
import { SlotRepository } from '../repository/slot.repository';
import { IBookingService } from './interface/iBooking.service';
import { BookingService } from './booking.service';
import { IBillService } from './interface/iBill.service';
import { BillService } from './bill.service';
import { IBookedSlotRepository } from '../repository/interface/iBookedSlot.repository';
import { BookedSlotRepository } from '../repository/bookedSlot.repository';
import { IMemberSubscriptionService } from './interface/iMemberSubscription.service';
import { MemberSubscriptionService } from './memberSubscription.service';
import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { ISubscriptionService } from './interface/iSubscription.service';
import { SubscriptionFactory } from './subscription.service';
import { acquireLock, releaseLock } from './redis.service';
import { IPaymentService } from './interface/iPayment.service';
import { PaymentService } from './payment.service';

export type bookSlotInfo = {
  date: Date;
  slotId: string;
  bookingId: string;
  checkedIn: checkInStatus;
  price: number;
};
export class BookedSlotService implements IBookedSlotService {
  private static Instance: BookedSlotService;
  public static getInstance(): IBookedSlotService {
    if (!this.Instance) {
      this.Instance = new BookedSlotService();
    }
    return this.Instance;
  }
  private static _subscriptionService: ISubscriptionService;
  private static _slotRepository: ISlotRepository;
  private static _bookingService: IBookingService;
  private static _billService: IBillService;
  private static _bookedSlotRepository: IBookedSlotRepository;
  private static _memberSubscriptionService: IMemberSubscriptionService;
  private static _paymentService: IPaymentService;
  static {
    this._memberSubscriptionService = MemberSubscriptionService.getInstance();
    this._bookedSlotRepository = BookedSlotRepository.getInstance();
    this._billService = BillService.getInstance();
    this._bookingService = BookingService.getInstance();
    this._slotRepository = SlotRepository.getInstance();
    this._subscriptionService = SubscriptionFactory.getInstance();
    this._paymentService = PaymentService.getInstance();
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
    type lockCheck = {
      slotId: string;
      date: Date;
      quantity: number;
    };
    var listLockCheck: lockCheck[] = [
      {
        date: slotList[0].date,
        slotId: slotList[0].slotId,
        quantity: 0,
      },
    ];
    // sort để gán giá của vào từng slot và push vào bookedSlotInfoList
    slots.forEach((slot) => {
      slotList.forEach((data) => {
        if (slot.id === data.slotId) {
          bookedSlotInfoList.push({
            checkedIn: 'pending',
            date: new Date(data.date),
            price: slot.price,
            bookingId: '0',
            slotId: data.slotId,
          });
        }
      });
    });

    slotList.forEach((slot) => {
      listLockCheck.forEach((data) => {
        console.log(data);
        if (slot.slotId === data.slotId && slot.date === data.date) {
          data.quantity += 1;
        } else {
          listLockCheck.push({
            date: slot.date,
            quantity: 1,
            slotId: slot.slotId,
          });
        }
      });
    });

    console.log(listLockCheck);

    // tính total price để tạo bill
    const totalPrice = bookedSlotInfoList.reduce(
      (sum, slot) => sum + slot.price,
      0
    );
    const totalTime = slots.reduce(
      (sum, slot) => sum + (slot.endTime.getTime() - slot.endTime.getTime()),
      0
    );
    console.log(totalPrice);

    //lock
    const acquireProduct = await Promise.all(
      listLockCheck.map(async (x) => {
        const keyLock = await acquireLock(x.slotId, x.date, x.quantity);
        if (keyLock) {
          await releaseLock(keyLock);
        }
        return keyLock ? true : false;
      })
    );
    console.log(acquireProduct);
    if (acquireProduct.includes(false)) {
      throw new BadRequestError('Booked slot is not valid');
    }
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
      var payment = await BookedSlotService._paymentService.momoPayment({
        price: totalPrice,
        orderId: booking.id,
        returnUrl: '/bookedSlot/momo/PaymentCallBack',
      });
      await BookedSlotService._bookedSlotRepository.createBookedSlot(
        bookedSlotInfoList
      );
      return payment;
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
      return await BookedSlotService._bookedSlotRepository.createBookedSlot(
        bookedSlotInfoList
      );
    }
  }

  public async getAllBookedSlot(): Promise<bookedSlot[]> {
    return await BookedSlotService._bookedSlotRepository.getAllBookedSlot();
  }

  public async findBookedSlot(id: string): Promise<bookedSlot | null> {
    return await BookedSlotService._bookedSlotRepository.findBookedSlot(id);
  }

  public async getBookedSlotWithDateAndSlotId({
    slotId,
    date,
  }: {
    slotId: string;
    date: Date;
  }): Promise<bookedSlot[]> {
    return await BookedSlotService._bookedSlotRepository.findBookedSlotByDateAndSlotId(
      {
        slotId,
        date,
      }
    );
  }
}
