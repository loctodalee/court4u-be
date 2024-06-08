export interface IPayementService {
  momoPayment({
    price,
    orderId,
  }: {
    price: number;
    orderId: string;
  }): Promise<any>;

  momoCallBack(): Promise<any>;
}
