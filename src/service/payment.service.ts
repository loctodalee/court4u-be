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
    const requestId = process.env.MOMO_PARTNER_CODE! + new Date().getTime();
    const orderInfo = 'Thanh toán qua ví momo';
    const payUrl = process.env.MOMO_RETURN_URL + returnUrl;
    var ipnUrl = payUrl;
    var extraData = '';
    var orderGroupId = '';
    // const rawSignature = `partnerCode=${process.env.MOMO_PARTNER_CODE}&accessKey=${process.env.MOMO_ACCESS_KEY}&requestId=${requestId}&amount=${price}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${payUrl}&notifyUrl=${process.env.MOMO_NOTIFY_URL}&requestExpire=${requestExpire}&extraData=`;
    // const rawSignature = `partnerCode=${process.env.MOMO_PARTNER_CODE}&accessKey=${process.env.MOMO_ACCESS_KEY}&requestId=${requestId}&amount=${price}&orderId=${orderId}&orderInfo=${orderInfo}&returnUrl=${payUrl}&notifyUrl=${process.env.MOMO_NOTIFY_URL}&extraData=`;
    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${price}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${process.env.MOMO_PARTNER_CODE}&redirectUrl=${payUrl}&requestId=${requestId}&requestType=${process.env.MOMO_REQUEST_TYPE}`;
    console.log('Raw Signature:', rawSignature);
    console.log(rawSignature);
    const signature = crypto
      .createHmac('sha256', process.env.MOMO_SERECT_KEY!)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: process.env.MOMO_PARTNER_CODE,
      partnerName: 'Test',
      storeId: 'MomoTestStore',
      requestId: requestId,
      amount: price,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: payUrl,
      ipnUrl: ipnUrl,
      lang: 'vi',
      requestType: process.env.MOMO_REQUEST_TYPE,
      autoCapture: true,
      extraData: extraData,
      orderGroupId: orderGroupId,
      orderExpireTime: 10,
      signature: signature,
    });

    const options = {
      hostname: 'test-payment.momo.vn',
      port: 443,
      path: '/v2/gateway/api/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(requestBody),
      },
    };

    return new Promise((resolve, reject) => {
      const momoRequest = https.request(options, (momoResponse) => {
        let data = '';
        momoResponse.setEncoding('utf-8');
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
