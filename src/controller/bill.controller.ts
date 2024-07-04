const { SuccessResponse } = require('../handleResponse/success.response');
import { Request, Response } from 'express';
import { BillService } from '../service/bill.service';
import { IBillService } from '../service/interface/iBill.service';

export class BillController {
  private static Instance: BillController;
  public static getInstance(): BillController {
    if (!this.Instance) {
      this.Instance = new BillController();
    }
    return this.Instance;
  }

  private static _billService: IBillService = BillService.getInstance();
  async getAllBill(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get bill success',
      metaData: await BillController._billService.getAllBills(),
    }).send(res);
  }

  async getBillById(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get bill success',
      metaData: await BillController._billService.getBillById(req.params.id),
    }).send(res);
  }
}
