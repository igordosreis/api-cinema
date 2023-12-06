/* eslint-disable max-lines-per-function */
import axios from 'axios';
import { BEARER_TOKEN, CREATE_PAYMENT_URL, EMAIL_WEBHOOK_MOCK } from '../constants';
import { IPaymentOrderRequest, IPaymentOrderResponse } from '../interfaces/IPayment';
import CustomError, { paymentOrderError } from './customError.util';

class Payment {
  createPayment = async (paymentOrderRequest: Omit<IPaymentOrderRequest, 'webhook' | 'name'>) => {
    try {
      const endpoint = CREATE_PAYMENT_URL;
      const body: IPaymentOrderRequest = {
        ...paymentOrderRequest,
        webhook: EMAIL_WEBHOOK_MOCK,
        name: 'Pagamento - Módulo Cinema',
      };
      const headers = {
        authorization: `${BEARER_TOKEN}`,
      };

      const { data } = await axios.post<IPaymentOrderResponse>(endpoint, body, { headers });

      return data;
    } catch (error: CustomError | unknown) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(paymentOrderError);
    }
  };
}

export default new Payment();
