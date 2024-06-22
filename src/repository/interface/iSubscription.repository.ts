import {
  subscriptionDetail,
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

  findSubscriptionOption({
    options,
  }: {
    options: any;
  }): Promise<subscriptionOption | null>;

  findSubscriptionDetail({
    options,
  }: {
    options: any;
  }): Promise<subscriptionDetail | null>;

  createSubscription({
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
  }): Promise<subscriptionOption>;

  createSubscriptionMonth({
    clubId,
    usesPerDay,
    playTime,
  }: {
    clubId: string;
    usesPerDay: number;
    playTime: number;
  }): Promise<subscriptionDetail>;

  createSubscriptionTime({
    clubId,
    totalTime,
  }: {
    clubId: string;
    totalTime: number;
  }): Promise<subscriptionDetail>;
}
