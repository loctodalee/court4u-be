"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const https_1 = __importDefault(require("https"));
class PaymentService {
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new PaymentService();
        }
        return this.Instance;
    }
    momoPayment(_a) {
        return __awaiter(this, arguments, void 0, function* ({ price, orderId, returnUrl, }) {
            const requestId = process.env.MOMO_PARTNER_CODE + new Date().getTime();
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
            const signature = crypto_1.default
                .createHmac('sha256', process.env.MOMO_SERECT_KEY)
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
                lang: 'en',
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
                const momoRequest = https_1.default.request(options, (momoResponse) => {
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
        });
    }
    momoCallBack() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.PaymentService = PaymentService;
