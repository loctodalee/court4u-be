import { $Enums, clubSubscription } from '@prisma/client';
import { IClubSubscriptionRepository } from './interface/iClubSubscription.repository';
import prisma from '../lib/prisma';
export class ClubSubscriptionRepository implements IClubSubscriptionRepository {
  private static Instance: ClubSubscriptionRepository;
  public static getInstance(): IClubSubscriptionRepository {
    if (!this.Instance) {
      this.Instance = new ClubSubscriptionRepository();
    }
    return this.Instance;
  }

  public async createClubSubscription(data: {
    clubId: string;
    subscriptionForClubId: string;
    billId: string;
    name: string;
    price: number;
    totalDate: number;
    startDate: Date;
    endDate: Date;
    status: $Enums.clubSubscriptionStatus;
  }): Promise<clubSubscription> {
    return await prisma.clubSubscription.create({
      data,
    });
  }

  public async updateClubSubs(
    id: string,
    data: {
      clubId?: string | undefined;
      subscriptionForClubId?: string | undefined;
      name?: string | undefined;
      price?: number | undefined;
      totalDate?: number | undefined;
      startDate?: Date | undefined;
      endDate?: Date | undefined;
      status?: $Enums.clubSubscriptionStatus | undefined;
    }
  ): Promise<clubSubscription> {
    return await prisma.clubSubscription.update({
      where: {
        id,
      },
      data,
    });
  }

  public async foundClubSubById(id: string): Promise<clubSubscription | null> {
    return await prisma.clubSubscription.findFirst({
      where: {
        id,
      },
    });
  }
}
