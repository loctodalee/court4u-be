import { IMemberSubscriptionService } from './interface/iMemberSubscription.service';
import { ISubscriptionService } from './interface/iSubscription.service';
import { SubscriptionFactory } from './subscription.service';
import {
  BadRequestError,
  NotFoundError,
} from '../handleResponse/error.response';
import { IUserService } from './interface/iUser.service';
import { UserService } from './user.service';
import { IPaymentService } from './interface/iPayment.service';
import { PaymentService } from './payment.service';
import { IBillService } from './interface/iBill.service';
import { BillService } from './bill.service';
import { IMemberSubscriptionRepository } from '../repository/interface/iMemberSubscription.repository';
import { MemberSubscriptionRepository } from '../repository/memberSubscription.repository';
import { memberSubscription } from '@prisma/client';

export class MemberSubscriptionService implements IMemberSubscriptionService {
  private static Instance: MemberSubscriptionService;
  public static getInstance(): IMemberSubscriptionService {
    if (!this.Instance) {
      this.Instance = new MemberSubscriptionService();
    }
    return this.Instance;
  }

  private static _memberSubscriptionRepository: IMemberSubscriptionRepository;
  private static _subscriptionService: ISubscriptionService;
  private static _userService: IUserService;
  private static _paymentService: IPaymentService;
  private static _billService: IBillService;

  static {
    this._memberSubscriptionRepository =
      MemberSubscriptionRepository.getInstance();
    this._billService = BillService.getInstance();
    this._paymentService = PaymentService.getInstance();
    this._subscriptionService = SubscriptionFactory.getInstance();
    this._userService = UserService.getInstance();
  }
  public async buySubscription({
    subscriptionId,
    memberId,
  }: {
    subscriptionId: string;
    memberId: string;
  }): Promise<any> {
    const foundSubs =
      await MemberSubscriptionService._subscriptionService.findSubscriptionById(
        {
          keySearch: subscriptionId,
        }
      );
    if (!foundSubs) throw new BadRequestError('Subscription not found');

    const foundUser = await MemberSubscriptionService._userService.getUserById({
      id: memberId,
    });
    if (!foundUser) throw new BadRequestError('User not found');

    const bill = await MemberSubscriptionService._billService.createBill({
      method: 'momo',
      date: new Date(Date.now()),
      status: 'pending',
      total: foundSubs.price,
      type: 'memberSubscription',
    });
    const currentDate = new Date(Date.now());
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + foundSubs.totalDate);
    const subscriptionDetail =
      await MemberSubscriptionService._subscriptionService.findDetailById({
        keySearch: foundSubs.id,
      });
    let memberSubs: memberSubscription;

    switch (foundSubs.type) {
      case 'Month': {
        memberSubs =
          await MemberSubscriptionService._memberSubscriptionRepository.createMemberSubscription(
            {
              memberId,
              billId: bill.id,
              subscriptionId,
              usesHistory: [],
              startDate: new Date(Date.now()),
              endDate,
            }
          );
        break;
      }
      case 'Time': {
        memberSubs =
          await MemberSubscriptionService._memberSubscriptionRepository.createMemberSubscription(
            {
              memberId,
              billId: bill.id,
              subscriptionId,
              timeRemain: subscriptionDetail?.totalTime!,
              startDate: new Date(Date.now()),
              endDate,
            }
          );
        break;
      }
    }

    const payment = await MemberSubscriptionService._paymentService.momoPayment(
      {
        price: foundSubs.price,
        orderId: memberSubs!.id,
        returnUrl: '/memberSubscription/momo/PaymentCallBack',
      }
    );

    return payment;
  }

  public async paymentCallBack(args: any): Promise<any> {
    const { orderId, message } = args;
    const foundMemberSubs =
      await MemberSubscriptionService._memberSubscriptionRepository.foundMemberSubscription(
        {
          options: {
            where: {
              id: orderId,
            },
          },
        }
      );
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
        await MemberSubscriptionService._memberSubscriptionRepository.updateMemberSubscription(
          {
            options: updateMemberSubsOptions,
          }
        );

      // update bill status
      await MemberSubscriptionService._billService.updateBill(
        foundMemberSubs.billId,
        {
          status: 'success',
        }
      );

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
        await MemberSubscriptionService._memberSubscriptionRepository.updateMemberSubscription(
          {
            options: updateMemberSubsOptions,
          }
        );

      await MemberSubscriptionService._billService.updateBill(
        foundMemberSubs.billId,
        {
          status: 'fail',
        }
      );
      throw new Error('fail at payment');
    }
  }

  public async searchSubscription(
    id: string
  ): Promise<memberSubscription | null> {
    return await MemberSubscriptionService._memberSubscriptionRepository.foundMemberSubscription(
      {
        options: {
          where: {
            id,
          },
        },
      }
    );
  }

  public async updateMonthSubscription(
    id: string
  ): Promise<memberSubscription> {
    const today = new Date(Date.now()).toISOString().split('T')[0];
    const subscription =
      await MemberSubscriptionService._memberSubscriptionRepository.foundMemberSubscription(
        {
          options: {
            where: {
              id,
            },
          },
        }
      );
    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }
    if (!subscription.usesHistory.includes(today)) {
      const updatedSubscription =
        await MemberSubscriptionService._memberSubscriptionRepository.updateMemberSubscription(
          {
            options: {
              where: { id },
              data: {
                usesHistory: {
                  push: today,
                },
              },
            },
          }
        );
      return updatedSubscription;
    } else {
      return subscription;
    }
  }

  public async updateTimeSubscription(
    id: string,
    time: number
  ): Promise<memberSubscription> {
    const options = {
      where: {
        id,
      },
      data: {
        timeRemain: {
          decrement: time,
        },
      },
    };
    return await MemberSubscriptionService._memberSubscriptionRepository.updateMemberSubscription(
      {
        options,
      }
    );
  }
}
