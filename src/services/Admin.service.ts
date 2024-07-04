/* eslint-disable max-lines-per-function */
import { CONSOLE_LOG_ERROR_TITLE, STATUS_WAITING } from '../constants';
import db from '../database/models';
import CartModel from '../database/models/Cart.model';
import OrdersModel from '../database/models/Orders.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IOrderUpdate } from '../interfaces/IOrder';
import { IPaymentOrderResponse } from '../interfaces/IPayment';
import OrdersService from './Orders.service';

export default class AdminService {
  public static async resolvePaymentStatus(paymentOrderResponse: IPaymentOrderResponse) {
    const { orderId, userId, status } = paymentOrderResponse;

    // type StatusHandler = keyof typeof statusHandler;
    const statusHandler = {
      paid: async (updateParams: IOrderUpdate) => {
        await this.orderSuccess(updateParams);
      },
      canceled: async (updateParams: IOrderUpdate) => {
        await this.orderFail(updateParams);
      },
      expired: async (updateParams: IOrderUpdate) => {
        await this.orderFail(updateParams);
      },
      waiting: async () => {},
    };

    const updateOrder = statusHandler[status];

    if (!updateOrder) throw new Error('Status inválido');

    await updateOrder({ orderId, userId, status });
  }

  private static async orderSuccess({ orderId, userId, status }: IOrderUpdate) {
    const t = await db.transaction();
    try {
      const { vouchersOrderUnpaid } = await OrdersService.getOrderById({
        orderId,
        userId,
        status: STATUS_WAITING,
        transaction: t,
        isAdmin: true,
      });
      const parsedVouchersOrderUnpaid = vouchersOrderUnpaid.map((voucher) => ({
        ...voucher.dataValues,
      }));

      await VouchersUserModel.bulkCreate(parsedVouchersOrderUnpaid, { transaction: t });
      await VouchersAvailableModel.destroy({
        where: { orderId },
        transaction: t,
      });
      await OrdersModel.update(
        { status, expireAt: null },
        {
          where: { id: orderId, userId },
          transaction: t,
        },
      );

      await CartModel.destroy({
        where: { userId, waiting: true },
        transaction: t, 
      });

      await t.commit();
    } catch (error) {
      await t.rollback();

      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new Error();
    }
  }

  private static async orderFail({ orderId, userId, status }: IOrderUpdate) {
    // const t = await db.transaction();
    // try {
    //   await VouchersAvailableModel.update(
    //     { orderId: null, soldPrice: null },
    //     { where: { orderId }, transaction: t },
    //   );
    //   await OrdersModel.update({ status }, { where: { id: orderId, userId }, transaction: t });

    //   await t.commit();
    // } catch (error) {
    //   await t.rollback();

    //   console.log(error);
    //   throw new Error();
    // }
    await OrdersService.cancelOrder({ orderId, userId, status });
  }
}
