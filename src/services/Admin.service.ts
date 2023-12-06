import { IPaymentOrderResponse } from '../interfaces/IPayment';

export default class AdminService {
  public static async resolvePaymentStatus(paymentOrderResponse: IPaymentOrderResponse) {
    return paymentOrderResponse;
  }
}
