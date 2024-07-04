import { BillStatus, BillType, PrismaClient, bill } from '@prisma/client';
import { List } from 'lodash';
import { IBillRepository } from './interface/iBill.repository';

const prisma = new PrismaClient();

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
    return prisma.bill.delete({ where: { id } });
  }
}
