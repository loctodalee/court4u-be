import { BillStatus, BillType, bill } from '@prisma/client';
import { List } from 'lodash';

export interface IBillRepository {
  getBillById(id: string): Promise<bill | null>;
  getAllBills(): Promise<bill[]>;
  createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    status: BillStatus;
  }): Promise<bill>;
  updateBill(
    id: string,
    data: {
      method?: string;
      total?: number;
      date?: Date;
      type?: BillType;
      status?: BillStatus;
    }
  ): Promise<bill | null>;
  deleteBill(id: string): Promise<bill | null>;
}
