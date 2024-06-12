import { memberSubscription } from '@prisma/client';

export interface IMemberSubscriptionRepository {
  createMemberSubscription({
    memberId,
    subscriptionId,
    billId,
    detail,
    startDate,
    endDate,
  }: {
    memberId: string;
    subscriptionId: string;
    billId: string;
    detail: any;
    startDate: Date;
    endDate: Date;
  }): Promise<memberSubscription>;

  foundMemberSubscription({
    options,
  }: {
    options: any;
  }): Promise<memberSubscription | null>;
  updateMemberSubscription({
    options,
  }: {
    options: any;
  }): Promise<memberSubscription>;
}
