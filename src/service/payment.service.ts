import { IPaymentService } from './interface/iPayment.service';
import crypto from 'crypto';
import https from 'https';
export class PaymentService implements IPaymentService {
  private static Instance: PaymentService;
  public static getInstance(): IPaymentService {
    if (!this.Instance) {
      this.Instance = new PaymentService();
    }
    return this.Instance;
  }
  public async momoPayment({
    price,
    orderId,
    returnUrl,
  }: {
    price: number;
    orderId: string;
    returnUrl: string;
  }): Promise<any> {
    const requestId =
      process.env.MOMO_PARTNER_CODE! + new Date().getTime() + 'id';
    const orderInfo = 'Thanh toán qua ví momo';
    const payUrl = process.env.MOMO_RETURN_URL + returnUrl;
    const rawSignature = `partnerCode=${process.env.MOMO_PARTNER_CODE}&accessKey=${process.env.MOMO_ACCESS_KEY}&requestId=${requestId}&amount=${price}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${payUrl}&notifyUrl=${process.env.MOMO_NOTIFY_URL}&extraData=`;
    const signature = crypto
      .createHmac('sha256', process.env.MOMO_SERECT_KEY!)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId,
      amount: price.toString(),
      orderId,
      orderInfo,
      returnUrl: payUrl,
      notifyUrl: process.env.MOMO_NOTIFY_URL,
      extraData: '',
      requestType: process.env.MOMO_REQUEST_TYPE,
      signature: signature,
      lang: 'en',
    });

    const options = {
      hostname: new URL(process.env.MOMO_API_URL!).hostname,
      port: 443,
      path: new URL(process.env.MOMO_API_URL!).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    return new Promise((resolve, reject) => {
      const momoRequest = https.request(options, (momoResponse) => {
        let data = '';
        momoResponse.on('data', (chunk) => {
          data += chunk;
        });
        momoResponse.on('end', () => {
          resolve(JSON.parse(data));
        });
      });

      momoRequest.on('error', (error) => {
        reject(error);
      });

      momoRequest.write(requestBody);
      momoRequest.end();
    });
  }

  public async momoCallBack(): Promise<any> {}
}
