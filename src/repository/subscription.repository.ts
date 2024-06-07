import {
  subOptionMonth,
  subOptionTime,
  subscriptionOption,
  SubscriptionOptionStatus,
  SubscriptionType,
} from '@prisma/client';
import { ISubscriptionRepository } from './iSubscription.repository';
import prisma from '../lib/prisma';

export class SubscriptionRepository implements ISubscriptionRepository {
  private static Instance: SubscriptionRepository;
  public static getInstance(): SubscriptionRepository {
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
  public async createSubscription({
    id,
    clubId,
    name,
    price,
    startDate,
    endDate,
    status,
    type,
    detail,
  }: {
    id: string;
    clubId: string;
    name: string;
    price: number;
    startDate: Date;
    endDate: Date;
    status: SubscriptionOptionStatus;
    type: SubscriptionType;
    detail: Record<string, any>;
  }): Promise<subscriptionOption> {
    return await prisma.subscriptionOption.create({
      data: {
        id: id,
        clubId,
        name,
        price,
        endDate,
        startDate,
        status,
        type,
        detail,
      },
    });
  }

  public async createSubscriptionMonth({
    usesPerDay,
    playTime,
  }: {
    usesPerDay: number;
    playTime: number;
  }): Promise<subOptionMonth> {
    return await prisma.subOptionMonth.create({
      data: {
        playTime,
        usesPerDay,
      },
    });
  }
  public async createSubscriptionTime({
    totalTime,
  }: {
    totalTime: number;
  }): Promise<subOptionTime> {
    return await prisma.subOptionTime.create({
      data: {
        totalTime,
        timeRemain: totalTime,
      },
    });
  }
}
