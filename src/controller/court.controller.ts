import { Request, Response } from 'express';
import { ICourtService } from '../service/interface/iCourt.service';
import { CourtService } from '../service/court.service';

const { SuccessResponse } = require('../handleResponse/success.response');

export class CourtController {
  private static Instance: CourtController;
  public static getInstance(): CourtController {
    if (!this.Instance) {
      this.Instance = new CourtController();
    }
    return this.Instance;
  }
  /**
   * @description Tạo court mới
   * @param req {clubId,status?,number}
   * @param res {court}
   */
  async createCourt(req: Request, res: Response) {
    var courtService: ICourtService = new CourtService();
    new SuccessResponse({
      message: 'Create new court',
      metaData: await courtService.createCourt({ ...req.body }),
    }).send(res);
  }
}
