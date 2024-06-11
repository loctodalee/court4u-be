import { BillStatus, BillType, bill } from '@prisma/client';

export interface IBillRepository {
  createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    createdAt: Date;
    updatedAt: Date;
    status: BillStatus;
  }): Promise<bill>;
}
