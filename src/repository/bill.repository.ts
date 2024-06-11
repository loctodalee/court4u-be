import { BillStatus, BillType, PrismaClient, bill } from '@prisma/client';
import { IBillRepository } from '../repository/iBill.repository';

const prisma = new PrismaClient();

export class BillRepository implements IBillRepository {
  private static instance: BillRepository;

  public static getInstance(): BillRepository {
    if (!BillRepository.instance) {
      BillRepository.instance = new BillRepository();
    }
    return BillRepository.instance;
  }
  public async createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    createdAt: Date;
    updatedAt: Date;
    status: BillStatus;
  }): Promise<bill> {
    return prisma.bill.create({
      data: {
        method: data.method,
        total: data.total,
        date: data.date,
        type: data.type,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        status: data.status,
      },
    });
  }
}
