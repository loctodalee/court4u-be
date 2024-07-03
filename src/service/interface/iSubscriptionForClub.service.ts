import {
  SubcriptionForClubStatus,
  SubsciptionForClubType,
  subscriptionForClub,
} from '@prisma/client';

export interface ISubscriptionForClubService {
  createSubscription(data: {
    name: string;
    price: number;
    totalDate: number;
    type: SubsciptionForClubType;
    status: SubcriptionForClubStatus;
  }): Promise<subscriptionForClub>;

  searchById(id: string): Promise<subscriptionForClub | null>;
  getAllSubscription(): Promise<subscriptionForClub[]>;
}
