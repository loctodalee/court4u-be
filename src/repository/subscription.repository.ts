import {
  subscriptionDetail,
  subscriptionOption,
  SubscriptionOptionStatus,
  SubscriptionType,
} from '@prisma/client';
import { ISubscriptionRepository } from './interface/iSubscription.repository';
import prisma from '../lib/prisma';

export class SubscriptionRepository implements ISubscriptionRepository {
  private static Instance: SubscriptionRepository;
  public static getInstance(): ISubscriptionRepository {
    if (!this.Instance) {
      this.Instance = new SubscriptionRepository();
    }
    return this.Instance;
  }
  public async searchSubscriptions({
    options,
  }: {
    options: any;
  }): Promise<subscriptionOption[] | null> {
    return await prisma.subscriptionOption.findMany(options);
  }

  public async findSubscriptionOption({
    options,
  }: {
    options: any;
  }): Promise<subscriptionOption | null> {
    return await prisma.subscriptionOption.findFirst(options);
  }

  public async findSubscriptionDetail({
    options,
  }: {
    options: any;
  }): Promise<subscriptionDetail | null> {
    return await prisma.subscriptionDetail.findFirst(options);
  }
  public async createSubscription({
    id,
    clubId,
    name,
    price,
    totalDate,
    status,
    type,
  }: {
    id: string;
    clubId: string;
    name: string;
    price: number;
    totalDate: number;
    status: SubscriptionOptionStatus;
    type: SubscriptionType;
  }): Promise<subscriptionOption> {
    return await prisma.subscriptionOption.create({
      data: {
        id: id,
        clubId,
        name,
        price,
        totalDate,
        status,
        type,
      },
    });
  }

  public async createSubscriptionMonth({
    clubId,
    usesPerDay,
    playTime,
  }: {
    clubId: string;
    usesPerDay: number;
    playTime: number;
  }): Promise<subscriptionDetail> {
    return await prisma.subscriptionDetail.create({
      data: {
        clubId,
        playTime,
        usesPerDay,
        status: 'active',
      },
    });
  }
  public async createSubscriptionTime({
    clubId,
    totalTime,
  }: {
    clubId: string;
    totalTime: number;
  }): Promise<subscriptionDetail> {
    return await prisma.subscriptionDetail.create({
      data: {
        clubId,
        totalTime,
        status: 'active',
      },
    });
  }
}
