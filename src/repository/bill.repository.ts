import { BillStatus, BillType, PrismaClient, bill, slot } from '@prisma/client';
import { List } from 'lodash';
import { IBillRepository } from './interface/iBill.repository';
import prisma from '../lib/prisma';

export class BillRepository implements IBillRepository {
  private static instance: BillRepository;

  public static getInstance(): IBillRepository {
    if (!BillRepository.instance) {
      BillRepository.instance = new BillRepository();
    }
    return BillRepository.instance;
  }

  public async getBillById(id: string): Promise<bill | null> {
    return prisma.bill.findUnique({ where: { id } });
  }

  public async getAllBills(): Promise<bill[]> {
    return prisma.bill.findMany();
  }

  public async createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    status: BillStatus;
  }): Promise<bill> {
    return prisma.bill.create({ data });
  }

  public async updateBill(
    id: string,
    data: {
      method?: string;
      total?: number;
      date?: Date;
      type?: BillType;
      status?: BillStatus;
    }
  ): Promise<bill | null> {
    return prisma.bill.update({
      where: { id },
      data,
    });
  }

  public async deleteBill(id: string): Promise<bill | null> {
    return await prisma.bill.delete({ where: { id } });
  }

  public async getBillsByClubId(clubId: string): Promise<bill[]> {
    const bills = await prisma.bill.findMany({
      where: {
        OR: [
          {
            clubSubscription: {
              clubId,
            },
          },
          {
            memberSubscription: {
              subscriptionOption: {
                clubId,
              },
            },
          },
          {
            booking: {
              bookedSlot: {
                some: {
                  slot: {
                    clubId,
                  },
                },
              },
            },
          },
        ],
      },
    });
    return bills;
  }
}
