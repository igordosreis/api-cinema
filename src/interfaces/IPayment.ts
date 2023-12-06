export interface IPaymentOrderRequest {
  userId: number;
  orderId: number;
  expireAt: string;
  value: number;
  webhook: string;
  name: string;
}

export interface IPaymentOrderResponse extends IPaymentOrderRequest {
  id: number;
  productId: number;
}
