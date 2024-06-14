import { Request, Response } from 'express';
import { IClubSubscriptionService } from '../service/interface/iClubSubcription.service';
import { ClubSubscriptionService } from '../service/clubSubscription.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class ClubSubscriptionController {
  private static Instance: ClubSubscriptionController;
  public static getInstance(): ClubSubscriptionController {
    if (!this.Instance) {
      this.Instance = new ClubSubscriptionController();
    }
    return this.Instance;
  }

  public async clubBuySubscription(req: Request, res: Response) {
    var clubSubscriptionService: IClubSubscriptionService =
      new ClubSubscriptionService();
    new SuccessResponse({
      message: 'Payment redirect',
      metaData: await clubSubscriptionService.buySubscription({
        clubId: req.clubId,
        ...req.body,
      }),
    }).send(res);
  }

  public async paymentCallBack(req: Request, res: Response) {
    var clubSubscriptionService: IClubSubscriptionService =
      new ClubSubscriptionService();

    new SuccessResponse({
      message: 'Buy subscription',
      metaData: await clubSubscriptionService.paymentCallBack({
        ...req.query,
      }),
    }).send(res);
  }
}
