import { Request, Response } from 'express';
import { ISlotService } from '../service/interface/iSlot.service';
import { SlotService } from '../service/slot.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class SlotController {
  private static readonly slotService: ISlotService = SlotService.getInstance();
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
    new SuccessResponse({
      message: 'create new slot',
      metaData: await SlotController.slotService.createNewSlot({
        clubId: req.clubId,
        ...req.body,
      }),
    }).send(res);
  }

  /**
   * @description Thêm sân vào slot
   * @param req {slotId, courtId, status?}
   * @param res {slotOnCourt}
   */
  public async addCourtToSlot(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Add slot to court',
      metaData: await SlotController.slotService.assignNewSlotOnCourt({
        ...req.body,
      }),
    });
  }
}
