import { $Enums, memberSubscription, Prisma } from '@prisma/client';
import { IMemberSubscriptionRepository } from './interface/iMemberSubscription.repository';
import prisma from '../lib/prisma';

export class MemberSubscriptionRepository
  implements IMemberSubscriptionRepository
{
  private static Instance: MemberSubscriptionRepository;
  public static getInstance(): IMemberSubscriptionRepository {
    if (!this.Instance) {
      this.Instance = new MemberSubscriptionRepository();
    }
    return this.Instance;
  }
  public async createMemberSubscription({
    memberId,
    subscriptionId,
    billId,
    startDate,
    endDate,
    timeRemain,
    usesHistory,
  }: {
    memberId: string;
    subscriptionId: string;
    billId: string;
    startDate: Date;
    endDate: Date;
    timeRemain?: number;
    usesHistory?: [];
  }): Promise<memberSubscription> {
    return await prisma.memberSubscription.create({
      data: {
        billId,
        subscriptionId,
        memberId,
        status: 'pending',
        timeRemain,
        usesHistory,
        startDate,
        endDate,
      },
    });
  }

  public async foundMemberSubscription({
    options,
  }: {
    options: any;
  }): Promise<memberSubscription | null> {
    return await prisma.memberSubscription.findFirst(options);
  }

  public async updateMemberSubscription({
    options,
  }: {
    options: any;
  }): Promise<memberSubscription> {
    return await prisma.memberSubscription.update(options);
  }

  public async findBySubscriptionId(id: string): Promise<memberSubscription[]> {
    return await prisma.memberSubscription.findMany({
      where: {
        subscriptionId: id,
      },
    });
  }
}
