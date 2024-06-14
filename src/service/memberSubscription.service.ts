import { IMemberSubscriptionService } from './interface/iMemberSubscription.service';
import { ISubscriptionService } from './interface/iSubscription.service';
import { SubscriptionFactory } from './subscription.service';
import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { IUserService } from './interface/iUser.service';
import { UserService } from './user.service';
import { IPayementService } from './interface/iPayment.service';
import { PaymentService } from './payment.service';
import { IBillService } from './interface/iBill.service';
import { BillService } from './bill.service';
import { IMemberSubscriptionRepository } from '../repository/interface/iMemberSubscription.repository';
import { MemberSubscriptionRepository } from '../repository/memberSubscription.repository';
import prisma from '../lib/prisma';

export class MemberSubscriptionService implements IMemberSubscriptionService {
  private _memberSubscriptionRepository: IMemberSubscriptionRepository;
  private _subscriptionService: ISubscriptionService;
  private _userService: IUserService;
  private _paymentService: IPayementService;
  private _billService: IBillService;
  constructor() {
    this._memberSubscriptionRepository =
      MemberSubscriptionRepository.getInstance();
    this._subscriptionService = new SubscriptionFactory();
    this._userService = new UserService();
    this._paymentService = new PaymentService();
    this._billService = new BillService();
  }
  public async buySubscription({
    subscriptionId,
    memberId,
  }: {
    subscriptionId: string;
    memberId: string;
  }): Promise<any> {
    const foundSubs = await this._subscriptionService.searchSubscriptionById({
      keySearch: subscriptionId,
    });
    if (!foundSubs) throw new BadRequestError('Subscription not found');

    const foundUser = await this._userService.getUserById({ id: memberId });
    if (!foundUser) throw new BadRequestError('User not found');

    const bill = await this._billService.createBill({
      method: 'momo',
      date: new Date(Date.now()),
      status: 'pending',
      total: foundSubs.price,
      type: 'memberSubscription',
    });
    const currentDate = new Date(Date.now());
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + foundSubs.totalDate);
    const memberSubs =
      await this._memberSubscriptionRepository.createMemberSubscription({
        memberId,
        billId: bill.id,
        subscriptionId,
        startDate: new Date(Date.now()),
        endDate,
        detail: foundSubs.detail,
      });
    const payment = await this._paymentService.momoPayment({
      price: foundSubs.price,
      orderId: memberSubs.id,
      returnUrl: '/memberSubscription/momo/PaymentCallBack',
    });

    return payment;
  }

  public async paymentCallBack(args: any): Promise<any> {
    const { orderId, message } = args;
    const foundMemberSubs =
      await this._memberSubscriptionRepository.foundMemberSubscription({
        options: {
          where: {
            id: orderId,
          },
        },
      });
    if (!foundMemberSubs)
      throw new NotFoundError('Member Subscription not found');
    if (message == 'Success') {
      // update member subscription status
      const updateMemberSubsOptions = {
        where: {
          id: foundMemberSubs.id,
        },
        data: {
          status: 'active',
        },
      };
      const memberSubs =
        await this._memberSubscriptionRepository.updateMemberSubscription({
          options: updateMemberSubsOptions,
        });

      // update bill status
      await this._billService.updateBill(foundMemberSubs.billId, {
        status: 'success',
      });

      return memberSubs;
    } else {
      const updateMemberSubsOptions = {
        where: {
          id: foundMemberSubs.id,
        },
        data: {
          status: 'disable',
        },
      };
      const memberSubs =
        await this._memberSubscriptionRepository.updateMemberSubscription({
          options: updateMemberSubsOptions,
        });

      await this._billService.updateBill(foundMemberSubs.billId, {
        status: 'fail',
      });
      throw new Error('fail at payment');
    }
  }
}
