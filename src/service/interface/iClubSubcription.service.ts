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
  buySubscriptionFirstTime({
    fullname,
    email,
    phone,
    clubName,
    address,
    district,
    cityOfProvince,
    description,
    logoUrl,
    preOrder,
    subscriptionForClubId,
  }: {
    fullname: string;
    email: string;
    phone: string;
    clubName: string;
    address: string;
    district: string;
    cityOfProvince: string;
    description: string;
    logoUrl: string | null;
    preOrder: number;
    clubId: string;
    subscriptionForClubId: string;
  }): Promise<any>;

  paymentCallBackFirstTime(args: any): Promise<any>;
}
