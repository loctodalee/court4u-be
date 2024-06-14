import { $Enums, clubSubscription } from '@prisma/client';
export interface IClubSubscriptionService {
  buySubscription({
    clubId,
    subscriptionForClubId,
    name,
    price,
    totalDate,
    startDate,
    endDate,
    status,
  }: {
    clubId: string;
    subscriptionForClubId: string;
    name: string;
    price: number;
    totalDate: number;
    startDate: Date;
    endDate: Date;
    status: $Enums.clubSubscriptionStatus;
  }): Promise<any>;

  paymentCallBack(args: any): Promise<any>;
}
