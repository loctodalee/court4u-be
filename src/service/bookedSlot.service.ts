import Mail from 'nodemailer/lib/mailer';
import { bookedSlot, booking, checkInStatus, Prisma } from '@prisma/client';
import { bookSlot, IBookedSlotService } from './interface/iBookedSlot.service';
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
import QRCode, { QRCodeSegment } from 'qrcode';
import { IEmailService } from './interface/iEmail.service';
import { EmailService } from './email.service';
import { IUserService } from './interface/iUser.service';
import { UserService } from './user.service';
import nodemailer from 'nodemailer';
import { SendEmailV3_1 } from 'node-mailjet';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';
import _ from 'lodash';
export type bookSlotInfo = {
  date: Date;
  slotId: string;
  bookingId: string;
  checkedIn: checkInStatus;
  price: number;
};

export type QRMail = {
  date: Date;
  price: number;
  QRimg: string;
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
  private static _emailService: IEmailService;
  private static _userService: IUserService;
  private static _clubService: IClubService;
  static {
    this._memberSubscriptionService = MemberSubscriptionService.getInstance();
    this._bookedSlotRepository = BookedSlotRepository.getInstance();
    this._billService = BillService.getInstance();
    this._bookingService = BookingService.getInstance();
    this._slotRepository = SlotRepository.getInstance();
    this._subscriptionService = SubscriptionFactory.getInstance();
    this._paymentService = PaymentService.getInstance();
    this._emailService = EmailService.getInstance();
    this._userService = UserService.getInstance();
    this._clubService = ClubService.getInstance();
  }
  public async createBookedSlot({
    userId,
    subscriptionId,
    slotList,
  }: {
    userId: string;
    subscriptionId: string;
    slotList: bookSlot[];
  }): Promise<any> {
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

    // nếu pass thì vẫn còn sân để trong slot đó để book
    if (!subscriptionId) {
      const foundClub = await BookedSlotService._clubService.foundClubById({
        clubId: slots[0].clubId,
      });
      if (!foundClub) throw new BadRequestError('Club not found');

      const preOrderCost = (totalPrice * foundClub.preOrder) / 100;
      // nếu không có sử dụng gói để book slot
      const bill = await BookedSlotService._billService.createBill({
        date: new Date(Date.now()),
        method: 'momo',
        status: 'pending',
        total: preOrderCost,
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
        price: preOrderCost,
        orderId: booking.id,
        returnUrl: '/bookSlots/momo/PaymentCallBack',
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
          slotList.forEach(async (x) => {
            const memberSubscription =
              await BookedSlotService._memberSubscriptionService.updateMonthSubscription(
                memberSubs.id,
                x.date
              );
            if (!memberSubscription) {
              await BookedSlotService._bookingService.deleteBooking(booking.id);
              await BookedSlotService._billService.deleteBill(bill.id);
              throw new BadRequestError('Out of subscriptions');
            }
          });
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
      await BookedSlotService._bookedSlotRepository.createBookedSlot(
        bookedSlotInfoList
      );
      var bookedSlot =
        await BookedSlotService._bookedSlotRepository.getSlotByBookingId(
          booking.id
        );
      var attachments: SendEmailV3_1.InlinedAttachment[] = [];
      var listQRMail: QRMail[] = await Promise.all(
        bookedSlot.map(async (x, index) => {
          const qrBuffer = await QRCode.toBuffer(
            `http://localhost:8080/api/bookSlots/checkIn?bookedSlotId=${x.id}`
          );
          const attachmentId = `qr-${index}.png`;
          const base64QR = qrBuffer.toString('base64');

          attachments.push({
            ContentType: 'image/png',
            Filename: attachmentId,
            Base64Content: base64QR,
            ContentID: attachmentId,
          });
          return {
            date: x.date,
            price: x.price,
            QRimg: `<h4>Date: </h4>${x.date}</br><h4>Price: </h4>${x.price}</br><img src="cid:${attachmentId}"/>`,
          };
        })
      );
      const content = listQRMail
        .map((x) => {
          return x.QRimg;
        })
        .join('');
      const foundUser = await BookedSlotService._userService.getUserById({
        id: booking.userId,
      });
      if (!foundUser) throw new BadRequestError('user not foud');
      await BookedSlotService._emailService.sendEmailConfirmation({
        email: foundUser?.email,
        content,
        subject: 'Book court confirmation',
        attachment: attachments,
      });
      return bookedSlot;
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

  public async paymentCallBack(avgs: any): Promise<any> {
    const { orderId: bookingId, message } = avgs;
    const booking = await BookedSlotService._bookingService.foundBooking(
      bookingId
    );
    if (!booking) throw new BadRequestError('Booking not found!');
    if (message == 'Successful.') {
      const updateBooking =
        await BookedSlotService._bookingService.updateBookingStatus(
          bookingId,
          'active'
        );

      if (!updateBooking) throw new BadRequestError('Update booking fail');
      const billUpdate = await BookedSlotService._billService.updateBill(
        booking.billId,
        { status: 'success' }
      );

      if (!billUpdate) throw new BadRequestError('Bill update fail');
      var bookedSlot =
        await BookedSlotService._bookedSlotRepository.getSlotByBookingId(
          booking.id
        );
      var attachments: SendEmailV3_1.InlinedAttachment[] = [];
      var listQRMail: QRMail[] = await Promise.all(
        bookedSlot.map(async (x, index) => {
          const qrBuffer = await QRCode.toBuffer(
            `http://localhost:8080/api/bookSlots/checkIn?bookedSlotId=${x.id}`
          );
          const attachmentId = `qr-${index}.png`;
          const base64QR = qrBuffer.toString('base64');

          attachments.push({
            ContentType: 'image/png',
            Filename: attachmentId,
            Base64Content: base64QR,
            ContentID: attachmentId,
          });
          return {
            date: x.date,
            price: x.price,
            QRimg: `<h4>Date: </h4>${x.date}</br><h4>Price: </h4>${x.price}</br><img src="cid:${attachmentId}"/>`,
          };
        })
      );
      const content = listQRMail
        .map((x) => {
          return x.QRimg;
        })
        .join('');
      const foundUser = await BookedSlotService._userService.getUserById({
        id: booking.userId,
      });
      if (!foundUser) throw new BadRequestError('user not foud');
      await BookedSlotService._emailService.sendEmailConfirmation({
        email: foundUser?.email,
        content,
        subject: 'Book court confirmation',
        attachment: attachments,
      });
      return content;
    } else {
      const updateBooking =
        await BookedSlotService._bookingService.updateBookingStatus(
          bookingId,
          'canceled'
        );
      if (!updateBooking) throw new BadRequestError('Update booking fail');

      const billUpdate = await BookedSlotService._billService.updateBill(
        booking.billId,
        { status: 'fail' }
      );
      if (!billUpdate) throw new BadRequestError('Bill update fail');

      await BookedSlotService._bookedSlotRepository.deleteManyBookedSlot(
        booking.id
      );
      throw new BadRequestError('Fail at payment');
    }
  }

  public async updateCheckIn(bookedSlotId: string): Promise<any> {
    //find bookedSlot
    var bookedSlot =
      await BookedSlotService._bookedSlotRepository.findBookedSlot(
        bookedSlotId
      );
    if (!bookedSlot) throw new BadRequestError('Booked slot not found');
    //find booking
    var foundBooking = await BookedSlotService._bookingService.foundBooking(
      bookedSlot.bookingId
    );
    if (!foundBooking) throw new BadRequestError('Booking Not found');
    //find bill
    var foundBill = await BookedSlotService._billService.getBillById(
      foundBooking.billId
    );
    if (!foundBill) throw new BadRequestError('Bill not found');
    //find remain money
    const remainMoney = foundBooking.totalPrice - foundBill.total;
    //update booked slot checkiIn to "yes"
    if (bookedSlot.checkedIn == 'yes')
      throw new BadRequestError('Booked slot is not available');
    const bookSlot =
      await BookedSlotService._bookedSlotRepository.updateCheckIn({
        bookedSlotId: bookedSlot.id,
        checkIn: 'yes',
      });
    return {
      bookSlot,
      remainMoney,
    };
  }

  public async updateRemainMoney(
    bookedSlotId: string,
    money: number
  ): Promise<any> {
    var bookedSlot =
      await BookedSlotService._bookedSlotRepository.findBookedSlot(
        bookedSlotId
      );
    if (!bookedSlot) throw new BadRequestError('Booked slot not found');
    //find booking
    var foundBooking = await BookedSlotService._bookingService.foundBooking(
      bookedSlot.bookingId
    );
    if (!foundBooking) throw new BadRequestError('Booking Not found');
    //find bill
    var foundBill = await BookedSlotService._billService.getBillById(
      foundBooking.billId
    );
    if (!foundBill) throw new BadRequestError('Bill not found');
    //find remain money
    var bookingRemain =
      await BookedSlotService._bookingService.updateBookingPrice(
        foundBooking.id,
        foundBooking.totalPrice + money
      );
    const remainMoney = bookingRemain.totalPrice - foundBill.total;
    return {
      bookingRemain,
      remainMoney,
    };
  }
}
