export type IPaymentStatus = 'paid' | 'waiting' | 'cancelled' | 'expired';

export interface IPaymentOrderRequest {
  establishmentId: number;
  userId: number;
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
