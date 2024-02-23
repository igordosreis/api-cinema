/* eslint-disable max-lines-per-function */
import axios from 'axios';
import {
  BEARER_TOKEN,
  CONSOLE_LOG_ERROR_TITLE,
  CREATE_PAYMENT_URL,
  ADMIN_PAYMENT_WEBHOOK,
} from '../constants';
import { IPaymentOrderRequest, IPaymentOrderResponse } from '../interfaces/IPayment';
import CustomError, { paymentOrderError } from './customError.util';

class PaymentUtil {
  createPayment = async (paymentOrderRequest: Omit<IPaymentOrderRequest, 'webhook' | 'name'>) => {
    try {
      const endpoint = CREATE_PAYMENT_URL;
      const body: IPaymentOrderRequest = {
        ...paymentOrderRequest,
        webhook: ADMIN_PAYMENT_WEBHOOK,
        name: 'Pagamento - Módulo Cinema',
      };
      const headers = {
        authorization: `${BEARER_TOKEN}`,
      };

      const { data } = await axios.post<IPaymentOrderResponse>(endpoint, body, { headers });

      return data;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(paymentOrderError);
    }
  };
}

export default new PaymentUtil();
