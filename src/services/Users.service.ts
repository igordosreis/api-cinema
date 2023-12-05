/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import {
  IProductFromGetById,
  IProductWithSelectedVouchers,
} from '../interfaces/IProducts';
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
    const results = await EstablishmentsProductsModel.findOne({
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

    return results as IProductFromGetById;
    // return results.dataValues as unknown as IProductWithVouchers;
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

  public static async createOrder(orderRequest: IOrderRequestFormattedBody) {
    const t = await db.transaction();
    try {
      const { userId, orderInfo } = orderRequest;

      const productsWithSelectedVouchersPromise: Promise<IProductWithSelectedVouchers>[] = orderInfo
        .map(async ({ productId, amountRequested }) => {
          const productPromise = await this.getVouchersByProductId(productId, t);
          ordersUtil.validateVouchersAmount(productPromise, amountRequested);

          const { vouchersAvailable, ...restOfInfo } = productPromise;
          const productInfo = {
            ...restOfInfo.dataValues,
            vouchersSelected: vouchersAvailable.slice(0, amountRequested),
          };

          return productInfo;
        });
      const productsWithSelectedVouchers = await Promise.all(productsWithSelectedVouchersPromise);

      const totals = ordersUtil.calculateTotalPriceAndTotalUnits(
        productsWithSelectedVouchers,
      );

      const expireDate = dateUtils.addFiveMinutes(new Date());

      const { id: orderId } = await OrdersModel.create(
        { ...totals, expireDate, userId },
        { transaction: t },
      );

      const vouchersUpdatedOrderIdPromise = productsWithSelectedVouchers.map(
        async (productInfo) => {
          const { vouchersSelected } = productInfo;
          
          const vouchersUpdatedPromise = vouchersSelected.map(async (voucher) => {
            const { voucherCode } = voucher;
            
            const voucherPromise = await VouchersAvailableModel.update(
              { orderId, soldPrice: productInfo.price },
              { where: { voucherCode }, transaction: t },
            );

            return voucherPromise;
          });
          const vouchersUpdated = await Promise.all(vouchersUpdatedPromise);

          return vouchersUpdated;
        },
      );

      await Promise.all(vouchersUpdatedOrderIdPromise);

      await t.commit();
    } catch (error: CustomError | unknown) {
      t.rollback();

      if (error instanceof CustomError) throw error;
      // throw error;
      throw new CustomError(voucherServiceUnavailable);
    }
  }
}
