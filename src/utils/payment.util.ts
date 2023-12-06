/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { CREATE_PAYMENT_URL, EMAIL_WEBHOOK_MOCK } from '../constants';
import { IPaymentOrderRequest, IPaymentOrderResponse } from '../interfaces/IPayment';
import CustomError, { paymentOrderError } from './customError.util';

class Payment {
  createPayment = async ({
    userId,
    orderId,
    expireAt,
    value,
  }: Omit<IPaymentOrderRequest, 'webhook' | 'name'>) => {
    try {
      const endpoint = CREATE_PAYMENT_URL;
      const body: IPaymentOrderRequest = {
        userId,
        orderId,
        expireAt,
        value,
        webhook: EMAIL_WEBHOOK_MOCK,
        name: 'Pagamento - Módulo Cinema',
      };

      const { data } = await axios.post<IPaymentOrderResponse>(endpoint, body);

      return data;
    } catch {
      throw new CustomError(paymentOrderError);
    }
  };
}

export default new Payment();