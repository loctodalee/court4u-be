import { $Enums, clubSubscription } from '@prisma/client';
import { ClubSubscriptionRepository } from '../repository/clubSubscription.repository';
import { IClubSubscriptionRepository } from '../repository/interface/iClubSubscription.repository';
import { IClubSubscriptionService } from './interface/iClubSubcription.service';
import { IClubService } from './interface/iClub.service';
import { ClubService } from './club.service';
import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { ISubscriptionForClubService } from './interface/iSubscriptionForClub.service';
import { SubscriptionForClubService } from './subscriptionForClub.service';
import { IPaymentService } from './interface/iPayment.service';
import { PaymentService } from './payment.service';
import { IBillService } from './interface/iBill.service';
import { BillService } from './bill.service';

export class ClubSubscriptionService implements IClubSubscriptionService {
  private static Instance: ClubSubscriptionService;
  public static getInstance(): IClubSubscriptionService {
    if (!this.Instance) {
      this.Instance = new ClubSubscriptionService();
    }
    return this.Instance;
  }
  private static _clubSubsriptionRepo: IClubSubscriptionRepository;
  private static _clubService: IClubService;
  private static _subscriptionForClubService: ISubscriptionForClubService;
  private static _paymentService: IPaymentService;
  private static _billService: IBillService;
  static {
    this._clubSubsriptionRepo = ClubSubscriptionRepository.getInstance();
    this._clubService = ClubService.getInstance();
    this._subscriptionForClubService = SubscriptionForClubService.getInstance();
    this._paymentService = PaymentService.getInstance();
    this._billService = BillService.getInstance();
  }

  public async buySubscription({
    clubId,
    subscriptionForClubId,
    status = 'pending',
  }: {
    clubId: string;
    subscriptionForClubId: string;
    status: $Enums.clubSubscriptionStatus;
  }): Promise<any> {
    const foundClub = await ClubSubscriptionService._clubService.foundClubById({
      clubId,
    });
    if (!foundClub) throw new NotFoundError('Club not found');
    const foundSub =
      await ClubSubscriptionService._subscriptionForClubService.searchById(
        subscriptionForClubId
      );
    if (!foundSub) throw new NotFoundError('Subscription not found');
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    switch (foundSub.type) {
      case 'Month':
        endDate.setMonth(currentDate.getMonth() + foundSub.totalDate);
        break;
      case 'Day':
        endDate.setDate(currentDate.getDate() + foundSub.totalDate);
        break;
      case 'Year':
        endDate.setFullYear(currentDate.getFullYear() + foundSub.totalDate);
    }
    const curretDate = Date.now();
    const bill = await ClubSubscriptionService._billService.createBill({
      method: 'momo',
      total: foundSub.price,
      date: new Date(Date.now()),
      status: 'pending',
      type: 'ownerSubscription',
    });
    if (!bill) throw new BadRequestError('Create bill fail');

    const result =
      await ClubSubscriptionService._clubSubsriptionRepo.clubBuySubscription({
        clubId,
        subscriptionForClubId,
        billId: bill.id,
        name: foundSub.name,
        price: foundSub.price,
        totalDate: foundSub.totalDate,
        startDate: new Date(curretDate),
        endDate,
        status,
      });

    if (!result) throw new BadRequestError();
    const payment = await ClubSubscriptionService._paymentService.momoPayment({
      price: result.price,
      orderId: result.id,
      returnUrl: '/clubSubscription/momo/PaymentCallBack',
    });
    return payment;
  }

  public async paymentCallBack(args: any): Promise<any> {
    const { orderId, message } = args;
    const clubSubscription =
      await ClubSubscriptionService._clubSubsriptionRepo.foundClubSubById(
        orderId
      );
    if (!clubSubscription)
      throw new BadRequestError('Not found club subcription');
    const bill = await ClubSubscriptionService._billService.getBillById(
      clubSubscription.billId
    );
    if (!bill) throw new BadRequestError('Not found bill');
    if (message === 'Success') {
      const updateClubSub =
        await ClubSubscriptionService._clubSubsriptionRepo.updateClubSubs(
          clubSubscription.id,
          { status: 'active' }
        );
      await ClubSubscriptionService._billService.updateBill(bill.id, {
        status: 'success',
      });
      return updateClubSub;
    } else {
      await ClubSubscriptionService._clubSubsriptionRepo.updateClubSubs(
        clubSubscription.id,
        {
          status: 'disable',
        }
      );
      await ClubSubscriptionService._billService.updateBill(bill.id, {
        status: 'fail',
      });
      throw new BadRequestError('Payment fail');
    }
  }
}
