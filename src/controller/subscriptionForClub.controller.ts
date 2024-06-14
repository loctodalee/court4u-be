import { Request, Response } from 'express';
import { ISubscriptionForClubService } from '../service/interface/iSubscriptionForClub.service';
import { SubScriptionForClubService } from '../service/subscriptionForClub.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class SubscriptionForClubController {
  private static Instance: SubscriptionForClubController;
  public static getInstance(): SubscriptionForClubController {
    if (!this.Instance) {
      this.Instance = new SubscriptionForClubController();
    }
    return this.Instance;
  }

  public async createSubscription(req: Request, res: Response) {
    var subscriptionForClubService: ISubscriptionForClubService =
      new SubScriptionForClubService();
    new SuccessResponse({
      message: 'Create subscription for clubs',
      metaData: await subscriptionForClubService.createSubscription({
        ...req.body,
      }),
    }).send(res);
  }
}
