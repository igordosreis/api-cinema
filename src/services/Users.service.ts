/* eslint-disable max-lines-per-function */
import { Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IProductWithVouchers } from '../interfaces/IProducts';
import CustomError, { vouchersUnavailable } from '../utils/customError.util';

interface UpdateVouchersParams {
  productId: number;
  reservedStatus: boolean;
  amount: number;
}

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
    const productWithVouchers = await EstablishmentsProductsModel.findAll({
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

    return productWithVouchers as unknown as IProductWithVouchers;
  }

  public static async changeVouchersReservedStatus({
    productId,
    reservedStatus,
    amount,
  }: UpdateVouchersParams) {
    const t = await db.transaction();
    try {
      const productInfo = await this.getVouchersByProductId(productId);

      if (!productInfo.isAvailable) throw new CustomError(vouchersUnavailable);

      const updatedVouchersPromise = productInfo.vouchersAvailable
        .slice(0, amount)
        .map(async (voucher) => {
          const { voucherCode } = voucher;
          await VouchersAvailableModel.update(
            { reserved: reservedStatus },
            { where: { voucherCode }, transaction: t },
          );
        });

      await Promise.all(updatedVouchersPromise);

      await t.commit();
    } catch {
      t.rollback();

      throw new CustomError(vouchersUnavailable);
    }
  }
}
