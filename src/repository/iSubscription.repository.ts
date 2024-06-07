import {
  subOptionMonth,
  subOptionTime,
  subscriptionOption,
  SubscriptionOptionStatus,
  SubscriptionType,
} from '@prisma/client';

export interface ISubscriptionRepository {
  searchSubscriptions({
    options,
  }: {
    options: any;
  }): Promise<subscriptionOption[] | null>;

  createSubscription({
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
  }): Promise<subscriptionOption>;

  createSubscriptionMonth({
    usesPerDay,
    playTime,
  }: {
    usesPerDay: number;
    playTime: number;
  }): Promise<subOptionMonth>;

  createSubscriptionTime({
    totalTime,
  }: {
    totalTime: number;
  }): Promise<subOptionTime>;
}
