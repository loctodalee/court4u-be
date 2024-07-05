import { Request, Response } from 'express';
import { IClubService } from '../service/interface/iClub.service';
import { ClubService } from '../service/club.service';
import { ISlotService } from '../service/interface/iSlot.service';
import { SlotService } from '../service/slot.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class ClubController {
  private static readonly clubService: IClubService = ClubService.getInstance();
  private static readonly slotService: ISlotService = SlotService.getInstance();
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
    new SuccessResponse({
      message: 'create club success',
      metaData: await ClubController.clubService.addClub({
        courtOwnerId,
        ...req.body,
      }),
    }).send(res);
  }

  async findClub(req: Request, res: Response) {
    new SuccessResponse({
      message: 'create club success',
      metaData: await ClubController.slotService.findClubInfo({
        clubId: req.params.clubId as string,
      }),
    }).send(res);
  }
  async getClubs(req: Request, res: Response) {
    new SuccessResponse({
      message: 'get club success',
      metaData: await ClubController.clubService.getClubs(),
    }).send(res);
  }
  async updateClub(req: Request, res: Response) {
    const clubId = req.clubId;
    new SuccessResponse({
      message: 'update club success',
      metaData: await ClubController.clubService.updateClub(clubId, {
        ...req.body,
      }),
    }).send(res);
  }
  async deleteClub(req: Request, res: Response) {
    const clubId = req.clubId;
    new SuccessResponse({
      message: 'delete club success',
      metaData: await ClubController.clubService.deleteClub({ id: clubId }),
    }).send(res);
  }
}
