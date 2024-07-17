import { $Enums, clubSubscription } from '@prisma/client';
export interface IClubSubscriptionService {
  buySubscription({
    clubId,
    subscriptionForClubId,
    status,
  }: {
    clubId: string;
    subscriptionForClubId: string;
    status: $Enums.clubSubscriptionStatus;
  }): Promise<any>;

  paymentCallBack(args: any): Promise<any>;
  findClubSubsByClubId(id: string): Promise<clubSubscription | null>;
  getAll(): Promise<clubSubscription[]>;
  deleteClubSubscription(id: string): Promise<clubSubscription>;
}
