// iBill.service.ts

import { BillStatus, BillType, bill } from '@prisma/client';
import { List } from 'lodash';

export interface IBillService {
  getBillById(id: string): Promise<bill | null>;
  getAllBills(): Promise<List<bill>>;
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
  getBillsByClubId(clubId: string): Promise<bill[]>;
  getBillByOwnerId(id: string): Promise<bill[]>;
  getBillFullInfo(id: string): Promise<any>;
}
