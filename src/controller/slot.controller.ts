import { Request, Response } from 'express';
import { ISlotService } from '../service/interface/iSlot.service';
import { SlotService } from '../service/slot.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class SlotController {
  private static Instance: SlotController;
  public static getInstacnce(): SlotController {
    if (!this.Instance) {
      this.Instance = new SlotController();
    }
    return this.Instance;
  }
  /**
   * @description tạo slot mới
   * @param req {clubId, startTime, endTime, dateOfWeek}
   * @param res {slot}
   */
  public async createSlot(req: Request, res: Response) {
    var slotService: ISlotService = new SlotService();
    new SuccessResponse({
      message: 'create new slot',
      metaData: await slotService.createNewSlot({
        clubId: req.clubId,
        ...req.body,
      }),
    }).send(res);
  }
}
