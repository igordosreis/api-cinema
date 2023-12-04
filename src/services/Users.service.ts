/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IProductWithVouchers } from '../interfaces/IProducts';
import CustomError, { voucherServiceUnavailable } from '../utils/customError.util';
import { UpdateVouchersParams } from '../interfaces/IVouchers';
import ordersUtil from '../utils/orders.util';

export default class UsersService {
  public static async getUserVoucherHistory(userId: number) {
    const userVoucherHistory = await VouchersUserModel.findAll({
      where: { userId },
    });

    return userVoucherHistory;
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

  public static async createOrder(updateVoucherParams: UpdateVouchersParams) {
    const t = await db.transaction();
    try {
      const { productId, userId, amountRequested } = updateVoucherParams;
      const productInfo = await this.getVouchersByProductId(productId, t);

      ordersUtil.validateVouchersAmount(productInfo, updateVoucherParams);

      const vouchers = productInfo.vouchersAvailable.slice(0, amountRequested);

      const updateReservePromise = vouchers.map(async (voucher) => {
        const { voucherCode } = voucher;
        const updatePromise = await VouchersAvailableModel.update(
          { userId, soldPrice: productInfo.price },
          { where: { voucherCode }, transaction: t },
        );

        return updatePromise;
      });
      await Promise.all(updateReservePromise);

      await t.commit();
    } catch (error: CustomError | unknown) {
      t.rollback();

      if (error instanceof CustomError) throw error;
      throw new CustomError(voucherServiceUnavailable);
    }
  }
}
