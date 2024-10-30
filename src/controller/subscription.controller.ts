import { Request, Response } from 'express';
import { ISubscriptionService } from '../service/interface/iSubscription.service';
import { SubscriptionFactory } from '../service/subscription.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class SubscriptionController {
  private static readonly subscriptionService: ISubscriptionService =
    SubscriptionFactory.getInstance();
  private static Instance: SubscriptionController;
  public static getInstance(): SubscriptionController {
    if (!this.Instance) {
      this.Instance = new SubscriptionController();
    }
    return this.Instance;
  }

  /**
   * @description court owner tạo ra subcription để user mua
   * @param req {clubId(req.headers.api-key), name, price, startDate, endDate, status, type, detail:json}
   * @param res {subscription}
   */
  async createSubscription(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Create new subscription',
      metaData:
        await SubscriptionController.subscriptionService.createSubscription(
          req.body.type,
          {
            ...req.body,
            clubId: req.clubId,
          }
        ),
    }).send(res);
  }

  async getSubscriptionByClubId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Create new subscription',
      metaData:
        await SubscriptionController.subscriptionService.searchSubscriptionByClubId(
          {
            keySearch: req.params.clubId,
          }
        ),
    }).send(res);
  }
}
