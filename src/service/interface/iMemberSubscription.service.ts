import { memberSubscription } from '@prisma/client';

export interface IMemberSubscriptionService {
  buySubscription({
    subscriptionId,
    memberId,
  }: {
    subscriptionId: string;
    memberId: string;
  }): Promise<any>;

  paymentCallBack(args: any): Promise<any>;
}
