import { Request, Response } from 'express';
import { PaymentService } from '../service/payment.service';
const { SuccessResponse } = require('../handleResponse/success.response');

export class PaymentController {
  private static Instance: PaymentController;
  public static getInstance(): PaymentController {
    if (!this.Instance) {
      this.Instance = new PaymentController();
    }
    return this.Instance;
  }

  async MomoPayment(req: Request, res: Response) {
    var paymentService = new PaymentService();
    new SuccessResponse({
      message: 'Direct to momo payment',
      metaData: await paymentService.momoPayment({
        price: 1200,
        orderId: 'testtesttest1234567892222212231312',
      }),
    }).send(res);
  }

  async MomoCallBack(req: Request, res: Response) {
    res.status(200).json(req.query);
    console.log(req.query);
  }
}
