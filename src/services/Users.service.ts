/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IProductWithVouchers } from '../interfaces/IProducts';
import CustomError, { voucherServiceUnavailable } from '../utils/customError.util';
import { IOrderRequestFormattedBody } from '../interfaces/IVouchers';
import ordersUtil from '../utils/orders.util';
import OrdersModel from '../database/models/Orders.model';
import dateUtils from '../utils/date.utils';

export default class UsersService {
  public static async getUserVoucherHistory(userId: number) {
    // ---------- DEPRECADO ---------- DEPRECADO ---------- DEPRECADO
    const userVoucherHistory = await VouchersUserModel.findAll({
      where: { userId },
    });

    return userVoucherHistory;
    return `${userId} DEPRECADO`;
  }

  public static async getVouchersByProductId(productId: number, transaction?: Transaction) {
    const [results] = await EstablishmentsProductsModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: VouchersAvailableModel,
          as: 'vouchersAvailable',
          where: {
            orderId: null,
            expireDate: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      transaction: transaction || null,
      where: { id: productId },
      order: [[{ model: VouchersAvailableModel, as: 'vouchersAvailable' }, 'expireDate', 'ASC']],
    });

    return results as unknown as IProductWithVouchers;
    // const allProductVouchers = await VouchersAvailableModel.findAll({
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    //   where: { productId },
    //   order: [['expireDate', 'ASC']],
    //   include: [
    //     {
    //       model: EstablishmentsProductsModel,
    //       as: 'vouchersAvailable',
    //     },
    //   ],
    // });

    // return allProductVouchers as unknown as IProductWithVouchers;
  }

  public static async createOrder(updateVoucherParams: IOrderRequestFormattedBody) {
    const t = await db.transaction();
    try {
      const { userId, orderInfo } = updateVoucherParams;

      const productsInfoPromise = orderInfo.map(async ({ productId, amountRequested }) => {
        const productPromise = await this.getVouchersByProductId(productId, t);
        ordersUtil.validateVouchersAmount(productPromise, amountRequested);

        const productInfo = {
          ...productPromise,
          selectedVouchers: productPromise.vouchersAvailable.slice(0, amountRequested),
        };

        return productInfo;
      });
      const productsInfo = await Promise.all(productsInfoPromise);

      const totals = productsInfo.reduce(
        (accTotals, currProduct) => {
          const subTotal = currProduct.price * currProduct.selectedVouchers.length;

          const totalPrice = accTotals.totalPrice + subTotal;
          const totalUnits = accTotals.totalUnits + currProduct.selectedVouchers.length;

          return { totalPrice, totalUnits };
        },
        { totalPrice: 0, totalUnits: 0 },
      );

      const expireDate = dateUtils.addOneHour(
        new Date(
          new Date().toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
          }),
        ),
      );

      const { id: orderId } = await OrdersModel.create(
        { ...totals, expireDate, userId },
        { transaction: t },
      );
      console.log('orderId: ', orderId);

      // const updateReservePromise = vouchers.map(async (voucher) => {
      //   const { voucherCode } = voucher;
      //   const updatePromise = await VouchersAvailableModel.update(
      //     { orderId, userId, soldPrice: productInfo.price },
      //     { where: { voucherCode }, transaction: t },
      //   );

      //   return updatePromise;
      // });
      // await Promise.all(updateReservePromise);

      await t.commit();
    } catch (error: CustomError | unknown) {
      t.rollback();

      if (error instanceof CustomError) throw error;
      throw new CustomError(voucherServiceUnavailable);
    }
  }
}
