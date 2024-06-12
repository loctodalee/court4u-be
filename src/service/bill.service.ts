import { BillStatus, BillType, bill } from '@prisma/client';
import { List } from 'lodash';
import { BillRepository } from '../repository/bill.repository';
import { IBillService } from './interface/iBill.service';

export class BillService implements IBillService {
  private billRepository: BillRepository;

  constructor() {
    this.billRepository = BillRepository.getInstance();
  }

  public async getBillById(id: string): Promise<bill | null> {
    return this.billRepository.getBillById(id);
  }

  public async getAllBills(): Promise<List<bill>> {
    return this.billRepository.getAllBills();
  }

  public async createBill(data: {
    method: string;
    total: number;
    date: Date;
    type: BillType;
    status: BillStatus;
  }): Promise<bill> {
    return this.billRepository.createBill(data);
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
    return this.billRepository.updateBill(id, data);
  }

  public async deleteBill(id: string): Promise<bill | null> {
    return this.billRepository.deleteBill(id);
  }
}
