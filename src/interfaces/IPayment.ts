export type IPaymentStatus = 'paid' | 'waiting' | 'canceled' | 'expired';

export interface IPaymentOrderRequest {
  establishmentId: number;
  userId: string;
  orderId: number;
  expireAt: string;
  value: string;
  webhook: string;
  name: string;
}

export interface IPaymentModule {
  id: number;
  name: string;
}

export interface IPaymentOrderResponse extends IPaymentOrderRequest {
  id: number;
  productId: number;
  status: IPaymentStatus;
  paymentModules: IPaymentModule[];
}
