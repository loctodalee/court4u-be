import { BillStatus, BillType, bill } from '@prisma/client';
import { List } from 'lodash';
import { BillRepository } from '../repository/bill.repository';
import { IBillService } from './interface/iBill.service';
import { IBillRepository } from '../repository/interface/iBill.repository';

export class BillService implements IBillService {
  private static Instance: BillService;
  public static getInstance(): BillService {
    if (!this.Instance) {
      this.Instance = new BillService();
    }
    return this.Instance;
  }
  private static billRepository: IBillRepository = BillRepository.getInstance();

  constructor() {}

  public async getBillById(id: string): Promise<bill | null> {
    return BillService.billRepository.getBillById(id);
  }

  public async getAllBills(): Promise<List<bill>> {
    return BillService.billRepository.getAllBills();
  }

  public async createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    status: BillStatus;
  }): Promise<bill> {
    return BillService.billRepository.createBill(data);
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
    return BillService.billRepository.updateBill(id, data);
  }

  public async deleteBill(id: string): Promise<bill | null> {
    return BillService.billRepository.deleteBill(id);
  }
}
