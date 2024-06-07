import { Request, Response } from 'express';
import { ISubscriptionService } from '../service/iSubscription.service';
import { SubscriptionFactory } from '../service/subscription.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class SubscriptionController {
  private static Instance: SubscriptionController;
  public static getInstance(): SubscriptionController {
    if (!this.Instance) {
      this.Instance = new SubscriptionController();
    }
    return this.Instance;
  }

  async createSubscription(req: Request, res: Response) {
    var subscriptionService: ISubscriptionService = new SubscriptionFactory();
    new SuccessResponse({
      message: 'Create new subscription',
      metaData: await subscriptionService.createSubscription(req.body.type, {
        ...req.body,
        clubId: req.clubId,
      }),
    });
  }
}
