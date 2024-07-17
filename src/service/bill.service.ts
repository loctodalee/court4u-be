import { BillStatus, BillType, bill } from '@prisma/client';
import { List } from 'lodash';
import { BillRepository } from '../repository/bill.repository';
import { IBillService } from './interface/iBill.service';
import { IBillRepository } from '../repository/interface/iBill.repository';
import { getRedis } from '../lib/init.redis';
export class BillService implements IBillService {
  private static Instance: BillService;
  public static getInstance(): IBillService {
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
    return await BillService.billRepository.updateBill(id, data);
  }

  public async deleteBill(id: string): Promise<bill | null> {
    return await BillService.billRepository.deleteBill(id);
  }

  public async getBillsByClubId(clubId: string): Promise<bill[]> {
    return await BillService.billRepository.getBillsByClubId(clubId);
  }

  public async getBillByOwnerId(id: string): Promise<bill[]> {
    return await BillService.billRepository.getBillByOwnerId(id);
  }
}
