import {
  SubcriptionForClubStatus,
  SubsciptionForClubType,
  subscriptionForClub,
} from '@prisma/client';

export interface ISubscriptionForClubRepository {
  getAll(): Promise<subscriptionForClub[]>;
  createNewSubscription(data: {
    name: string;
    price: number;
    totalDate: number;
    type: SubsciptionForClubType;
    status: SubcriptionForClubStatus;
  }): Promise<subscriptionForClub>;

  updateSubscription(
    id: string,
    data: {
      name?: string;
      price?: number;
      totalDate?: number;
      type?: SubsciptionForClubType;
      status?: SubcriptionForClubStatus;
    }
  ): Promise<subscriptionForClub>;

  searchById(id: string): Promise<subscriptionForClub | null>;
}
