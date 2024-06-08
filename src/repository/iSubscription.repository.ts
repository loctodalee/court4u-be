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

  findSubscriptionOptionMonth({
    options,
  }: {
    options: any;
  }): Promise<subOptionMonth | null>;

  findSubscriptionOptionTime({
    options,
  }: {
    options: any;
  }): Promise<subOptionTime | null>;

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
    clubId,
    usesPerDay,
    playTime,
  }: {
    clubId: string;
    usesPerDay: number;
    playTime: number;
  }): Promise<subOptionMonth>;

  createSubscriptionTime({
    clubId,
    totalTime,
  }: {
    clubId: string;
    totalTime: number;
  }): Promise<subOptionTime>;
}
