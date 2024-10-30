import { clubSubscription, clubSubscriptionStatus } from '@prisma/client';

export interface IClubSubscriptionRepository {
  createClubSubscription(data: {
    clubId: string;
    subscriptionForClubId: string;
    billId: string;
    name: string;
    price: number;
    totalDate: number;
    startDate: Date;
    endDate: Date;
    status: clubSubscriptionStatus;
  }): Promise<clubSubscription>;
  updateClubSubs(
    id: string,
    data: {
      clubId?: string;
      subscriptionForClubId?: string;
      name?: string;
      price?: number;
      totalDate?: number;
      startDate?: Date;
      endDate?: Date;
      status?: clubSubscriptionStatus;
    }
  ): Promise<clubSubscription>;
  foundClubsubByClubId(id: string): Promise<clubSubscription | null>;
  foundClubSubById(id: string): Promise<clubSubscription | null>;
  getAll(): Promise<clubSubscription[]>;
}
