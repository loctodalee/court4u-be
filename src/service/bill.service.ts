import { BillStatus, BillType, bill } from '@prisma/client';
import { BillRepository } from '../repository/bill.repository';
import { IBillService } from './iBill.service';

export class BillService implements IBillService {
  private billRepository: BillRepository;

  constructor() {
    this.billRepository = BillRepository.getInstance();
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
    return this.billRepository.createBill(data);
  }
}
