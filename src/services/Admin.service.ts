import { IPaymentOrderResponse } from '../interfaces/IPayment';

export default class AdminService {
  public static async resolvePaymentStatus(paymentOrderResponse: IPaymentOrderResponse) {
    const { orderId, userId, status } = paymentOrderResponse;
    console.log(orderId, userId, status);
    return paymentOrderResponse;
  }
}
