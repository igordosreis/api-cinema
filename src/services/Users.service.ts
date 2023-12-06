/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IProductFromGetById, IProductWithSelectedVouchers } from '../interfaces/IProducts';
import CustomError, { voucherServiceUnavailable } from '../utils/customError.util';
import { IOrderInfoFormatted, IOrderRequestFormattedBody } from '../interfaces/IVouchers';
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
            expireAt: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      transaction: transaction || null,
      where: { id: productId },
      order: [[{ model: VouchersAvailableModel, as: 'vouchersAvailable' }, 'expireAt', 'ASC']],
    });

    return results as IProductFromGetById;
  }

  public static async createOrder(orderRequest: IOrderRequestFormattedBody) {
    const t = await db.transaction();
    try {
      const { userId, orderInfo } = orderRequest;

      const productsWithSelectedVouchers = await this.getProductWithSelectedVouchers(orderInfo, t);

      const totals = ordersUtil.calculateTotalPriceAndTotalUnits(productsWithSelectedVouchers);

      const expireAt = dateUtils.addFiveMinutes(new Date());

      const { id: orderId } = await OrdersModel.create(
        { ...totals, expireAt, userId },
        { transaction: t },
      );

      await this.updateVouchersOnCreateOrder(productsWithSelectedVouchers, orderId, t);

      await t.commit();

      // -- chamar microservice pagamento para enviar 'create payment'--
    } catch (error: CustomError | unknown) {
      t.rollback();

      if (error instanceof CustomError) throw error;
      // throw error;
      throw new CustomError(voucherServiceUnavailable);
    }
  }

  private static async getProductWithSelectedVouchers(
    orderInfo: IOrderInfoFormatted[],
    transaction: Transaction,
  ) {
    const productsWithSelectedVouchersPromise: Promise<IProductWithSelectedVouchers>[] = orderInfo
      .map(async ({ productId, amountRequested }) => {
        const productPromise = await this.getVouchersByProductId(productId, transaction);
        ordersUtil.validateVouchersAmount(productPromise, amountRequested);

        const { vouchersAvailable, ...restOfInfo } = productPromise;
        const productInfo = {
          ...restOfInfo.dataValues,
          vouchersSelected: vouchersAvailable.slice(0, amountRequested),
        };

        return productInfo;
      });
    const productsWithSelectedVouchers = await Promise.all(productsWithSelectedVouchersPromise);

    return productsWithSelectedVouchers;
  }

  private static async updateVouchersOnCreateOrder(
    productsWithSelectedVouchers: IProductWithSelectedVouchers[],
    orderId: number,
    transaction: Transaction,
  ) {
    const vouchersUpdatedOrderIdPromise = productsWithSelectedVouchers.map(async (productInfo) => {
      const { vouchersSelected } = productInfo;

      const vouchersUpdatedPromise = vouchersSelected.map(async (voucher) => {
        const { voucherCode } = voucher;

        await VouchersAvailableModel.update(
          { orderId, soldPrice: productInfo.price },
          { where: { voucherCode }, transaction },
        );
      });

      await Promise.all(vouchersUpdatedPromise);
    });

    await Promise.all(vouchersUpdatedOrderIdPromise);
  }
}
