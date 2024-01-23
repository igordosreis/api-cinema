import { Request, Response } from 'express';
import { IPaymentOrderResponse } from '../interfaces/IPayment';
import { AdminService } from '../services';

export default class AdminController {
  public static async resolvePaymentStatus(req: Request, res: Response): Promise<void> {
    const paymentOrderResponse = <IPaymentOrderResponse>req.body;

    await AdminService.resolvePaymentStatus(paymentOrderResponse);

    res.status(200).end();
  }
}
