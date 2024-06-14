import {
  $Enums,
  SubcriptionForClubStatus,
  SubsciptionForClubType,
  subscriptionForClub,
} from '@prisma/client';
import { ISubscriptionForClubRepository } from './interface/iSubscriptionForClub.repository';
import prisma from '../lib/prisma';
export class SubscriptionForClubRepository
  implements ISubscriptionForClubRepository
{
  private static Instance: SubscriptionForClubRepository;
  public static getInstance(): SubscriptionForClubRepository {
    if (!this.Instance) {
      this.Instance = new SubscriptionForClubRepository();
    }
    return this.Instance;
  }

  public async searchById(id: string): Promise<subscriptionForClub | null> {
    return await prisma.subscriptionForClub.findFirst({
      where: {
        id,
      },
    });
  }
  public async createNewSubscription(data: {
    name: string;
    price: number;
    totalDate: number;
    type: SubsciptionForClubType;
    status: SubcriptionForClubStatus;
  }): Promise<subscriptionForClub> {
    return await prisma.subscriptionForClub.create({
      data,
    });
  }

  public async updateSubscription(
    id: string,
    data: {
      name?: string | undefined;
      price?: number | undefined;
      totalDate?: number | undefined;
      type?: SubsciptionForClubType | undefined;
      status?: SubcriptionForClubStatus | undefined;
    }
  ): Promise<subscriptionForClub> {
    return await prisma.subscriptionForClub.update({
      where: {
        id,
      },
      data,
    });
  }
}
