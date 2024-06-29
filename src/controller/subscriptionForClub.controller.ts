import { Request, Response } from 'express';
import { ISubscriptionForClubService } from '../service/interface/iSubscriptionForClub.service';
import { SubscriptionForClubService } from '../service/subscriptionForClub.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class SubscriptionForClubController {
  private static readonly subscriptionForClubService: ISubscriptionForClubService =
    SubscriptionForClubService.getInstance();
  private static Instance: SubscriptionForClubController;
  public static getInstance(): SubscriptionForClubController {
    if (!this.Instance) {
      this.Instance = new SubscriptionForClubController();
    }
    return this.Instance;
  }

  public async createSubscription(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Create subscription for clubs',
      metaData:
        await SubscriptionForClubController.subscriptionForClubService.createSubscription(
          {
            ...req.body,
          }
        ),
    }).send(res);
  }
}
