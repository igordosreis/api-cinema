/* eslint-disable max-lines-per-function */
import db from '../database/models';
import OrdersModel from '../database/models/Orders.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IOrderFailedUpdate, IOrderSucessUpdate, IOrderUpdate } from '../interfaces/IOrder';
import { IPaymentOrderResponse } from '../interfaces/IPayment';
import UsersService from './Users.service';

export default class AdminService {
  public static async resolvePaymentStatus(paymentOrderResponse: IPaymentOrderResponse) {
    const { orderId, userId, status } = paymentOrderResponse;

    // type StatusHandler = keyof typeof statusHandler;
    const statusHandler = {
      paid: async (updateParams: IOrderUpdate) => {
        this.orderSuccess(updateParams);
      },
      cancelled: async (updateParams: IOrderUpdate) => {
        console.log(updateParams);
      },
      expired: async (updateParams: IOrderUpdate) => {
        console.log(updateParams);
      },
      waiting: async () => {},
    };

    const updateOrder = statusHandler[status];

    if (!updateOrder) throw new Error();

    await updateOrder({ orderId, userId, status });
  }

  private static async orderSuccess({ orderId, userId }: IOrderSucessUpdate) {
    const t = await db.transaction();
    try {
      const { vouchersOrderUnpaid } = await UsersService.getOrderById({
        orderId,
        userId,
        transaction: t,
      });

      const parsedVouchersOrderUnpaid = vouchersOrderUnpaid.map((voucher) => voucher.dataValues);
      await VouchersUserModel.bulkCreate(parsedVouchersOrderUnpaid, { transaction: t });
      await VouchersAvailableModel.destroy({
        where: { orderId },
        transaction: t,
      });
      await OrdersModel.update({ status: 'paid' }, { where: { orderId }, transaction: t });
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  }

  private static async orderFailed({ orderId, userId, status }: IOrderFailedUpdate) {
    console.log(orderId, userId, status);
  }
}
