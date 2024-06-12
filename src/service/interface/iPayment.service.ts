export interface IPayementService {
  momoPayment({
    price,
    orderId,
    returnUrl,
  }: {
    price: number;
    orderId: string;
    returnUrl: string;
  }): Promise<any>;

  momoCallBack(): Promise<any>;
}
