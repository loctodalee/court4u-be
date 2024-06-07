import {
  $Enums,
  Prisma,
  subscriptionOption,
  SubscriptionOptionStatus,
  SubscriptionType,
} from '@prisma/client';
import { BadRequestError } from '../handleResponse/error.response';
import { ISubscriptionRepository } from '../repository/iSubscription.repository';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { ISubscriptionService } from './iSubscription.service';

type SubscriptionConstructor = new (...args: any[]) => any;

export class SubscriptionFactory implements ISubscriptionService {
  private readonly _subscriptionRepository: ISubscriptionRepository;
  private static subsRegistry: { [type: string]: SubscriptionConstructor } = {};
  constructor() {
    this._subscriptionRepository = SubscriptionRepository.getInstance();
  }
  public registerSubscriptionType(type: string, classRef: any): void {
    SubscriptionFactory.subsRegistry[type] = classRef;
  }
  public createSubscription(type: string, payload: any): Promise<any> {
    const subscriptionClass = SubscriptionFactory.subsRegistry[type];
    if (!subscriptionClass) throw new BadRequestError('Subscription not found');
    return new subscriptionClass(payload).createSubscription();
  }

  public async updateSubscription({
    type,
    subscriptionId,
    payload,
  }: {
    type: string;
    subscriptionId: string;
    payload: string;
  }): Promise<any> {
    const subscriptionClass = SubscriptionFactory.subsRegistry[type];
    if (!subscriptionClass) throw new BadRequestError('Subscription not found');
    return new subscriptionClass(payload).updateSubscription({
      subscriptionId,
    });
  }

  public async searchSubscriptionByClubId({
    keySearch,
  }: {
    keySearch: string;
  }): Promise<subscriptionOption[] | null> {
    const options = {
      where: {
        clubId: keySearch,
      },
    };
    return await this._subscriptionRepository.searchSubscriptions({ options });
  }
}

class Subscription {
  clubId: string;
  name: string;
  price: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionOptionStatus;
  type: SubscriptionType;
  detail: any;
  _subscriptionRepository!: ISubscriptionRepository;
  constructor(
    clubId: string,
    name: string,
    price: number,
    startDate: Date,
    endDate: Date,
    type: SubscriptionType,
    status: SubscriptionOptionStatus,
    detail: Record<string, any>
  ) {
    this.clubId = clubId;
    this.name = name;
    this.price = price;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
    this.type = type;
    this._subscriptionRepository = SubscriptionRepository.getInstance();
    this.detail = detail;
  }

  async createSubscription(subscriptionId: string) {
    const newSubscription =
      await this._subscriptionRepository.createSubscription({
        id: subscriptionId,
        clubId: this.clubId,
        name: this.name,
        endDate: this.endDate,
        startDate: this.startDate,
        price: this.price,
        status: this.status,
        type: this.type,
        detail: this.detail,
      });
    return newSubscription;
  }
}

class SubscriptionOptionMonth extends Subscription {
  async createSubscription(): Promise<subscriptionOption> {
    const newSubsOptionMonth =
      await this._subscriptionRepository.createSubscriptionMonth({
        ...this.detail,
      });
    if (!newSubsOptionMonth) throw new BadRequestError('Fail to create detail');

    const newSubscription = await super.createSubscription(
      newSubsOptionMonth.id
    );
    return newSubscription;
  }
}

class SubscriptionOptionTime extends Subscription {
  async createSubscription(): Promise<subscriptionOption> {
    const newSubsOptionTime =
      await this._subscriptionRepository.createSubscriptionTime({
        ...this.detail,
      });
    if (!newSubsOptionTime) throw new BadRequestError('Fail to create detail');
    const newSubscription = await super.createSubscription(
      newSubsOptionTime.id
    );
    return newSubscription;
  }
}

const factory = new SubscriptionFactory();
factory.registerSubscriptionType('Month', SubscriptionOptionMonth);
factory.registerSubscriptionType('Time', SubscriptionOptionTime);
