/* eslint-disable max-lines-per-function */
import { Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IProductWithVouchers } from '../interfaces/IProducts';
import CustomError, { vouchersUnavailable } from '../utils/customError.util';
import { UpdateVouchersParams } from '../interfaces/IVouchers';
import vouchersUtil from '../utils/vouchers.util';

export default class UsersService {
  public static async getUserVoucherHistory(userId: number) {
    const userVoucherHistory = await VouchersUserModel.findAll({
      where: { userId },
    });

    return userVoucherHistory;
  }

  public static async getVouchersByProductId(productId: number) {
    // const allProductVouchers = await VouchersAvailableModel.findAll({
    //   attributes: { exclude: ['createdAt', 'updatedAt'] },
    //   where: { productId },
    //   order: [['expireDate', 'ASC']],
    // });

    // return allProductVouchers[0];
    const [results] = await EstablishmentsProductsModel.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: [
        {
          model: VouchersAvailableModel,
          as: 'vouchersAvailable',
          where: {
            reserved: 0,
            expireDate: {
              [Op.gt]: new Date(),
            },
          },
        },
      ],
      where: { id: productId },
      order: [[{ model: VouchersAvailableModel, as: 'vouchersAvailable' }, 'expireDate', 'ASC']],
    });

    return results as unknown as IProductWithVouchers;
  }

  public static async changeVouchersReserveStatus(updateVoucherParams: UpdateVouchersParams) {
    const t = await db.transaction();
    try {
      const { productId, reserveStatus, userId, amount } = updateVoucherParams;
      const productInfo = await this.getVouchersByProductId(productId);

      vouchersUtil.validateRequestParams(productInfo, updateVoucherParams);

      const updatedVouchersPromise = productInfo.vouchersAvailable
        .slice(0, amount)
        .map(async (voucher) => {
          const { voucherCode } = voucher;
          const updatePromise = await VouchersAvailableModel.update(
            { reserved: reserveStatus, userId },
            { where: { voucherCode }, transaction: t },
          );

          return updatePromise;
        });

      await Promise.all(updatedVouchersPromise);

      await t.commit();
    } catch (error: CustomError | any) {
      t.rollback();

      if (error.status) throw error;
      throw new CustomError(vouchersUnavailable);
    }
  }
}
