import { Request, Response } from 'express';
import { IMemberSubscriptionService } from '../service/interface/iMemberSubscription.service';
import { MemberSubscriptionService } from '../service/memberSubscription.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class MemberSubscriptionController {
  private static readonly memberSubscriptionService: IMemberSubscriptionService =
    MemberSubscriptionService.getInstance();
  private static Instance: MemberSubscriptionController;
  public static getInstance(): MemberSubscriptionController {
    if (!this.Instance) {
      this.Instance = new MemberSubscriptionController();
    }
    return this.Instance;
  }

  public async buyMemberSubscription(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Direct Payment',
      metaData:
        await MemberSubscriptionController.memberSubscriptionService.buySubscription(
          {
            memberId: req.user.userId,
            ...req.body,
          }
        ),
    }).send(res);
  }

  public async paymentCallBack(req: Request, res: Response) {
    await MemberSubscriptionController.memberSubscriptionService.paymentCallBack(
      {
        ...req.query,
      }
    ),
      res.redirect(`https://court4u-fe.vercel.app/thanks`);
  }

  public async findBySubscriptionId(req: Request, res: Response) {
    new SuccessResponse({
      message: 'Find membersubscription',
      metaData:
        await MemberSubscriptionController.memberSubscriptionService.findMemberSubscriptionBySubId(
          req.params.id
        ),
    }).send(res);
  }
}
