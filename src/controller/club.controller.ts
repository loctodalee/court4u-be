import { Request, Response } from 'express';
import { IClubService } from '../service/interface/iClub.service';
import { ClubService } from '../service/club.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class ClubController {
  private static Instance: ClubController;
  public static getInstance(): ClubController {
    if (!this.Instance) {
      this.Instance = new ClubController();
    }
    return this.Instance;
  }
  /**
   * @description tạo 1 club mới
   * @param req {name, address, district, cityOfProvince, logoUrl?, description?}
   * @param res {club}
   */
  async createClub(req: Request, res: Response) {
    const courtOwnerId = req.user.userId;
    var clubService: IClubService = new ClubService();
    new SuccessResponse({
      message: 'create club success',
      metaData: await clubService.createClub({
        courtOwnerId,
        ...req.body,
      }),
    }).send(res);
  }

  async findClub(req: Request, res: Response) {
    var clubService: IClubService = new ClubService();
    new SuccessResponse({
      message: 'create club success',
      metaData: await clubService.foundClubById({
        clubId: req.params.clubId as string,
      }),
    }).send(res);
  }
}
