import {
  ClubSubcriptionStatus,
  ClubSubsciptionType,
  clubSubscription,
} from '@prisma/client';

export interface IClubSubscriptionService {
  createClubSubCription({
    name,
    price,
    totalDate,
    type,
    status,
  }: {
    name: String;
    price: number;
    totalDate: number;
    type: ClubSubsciptionType;
    status: ClubSubcriptionStatus;
  }): Promise<clubSubscription>;
}
