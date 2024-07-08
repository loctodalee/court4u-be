import { Request, Response } from 'express';
import { ICourtService } from '../service/interface/iCourt.service';
import { CourtService } from '../service/court.service';
import { club } from '@prisma/client';

const { SuccessResponse } = require('../handleResponse/success.response');

export class CourtController {
  private static readonly courtService: ICourtService =
    CourtService.getInstance();
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
    new SuccessResponse({
      message: 'Create new court',
      metaData: await CourtController.courtService.createCourt({
        clubId: req.clubId,
        ...req.body,
      }),
    }).send(res);
  }
  async getAllCourtByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get  new court',
      metaData: await CourtController.courtService.getAllCourtByClubId(
        req.clubId
      ),
    }).send(res);
  }
}
