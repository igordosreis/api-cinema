import { Op } from 'sequelize';
// import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
// import { IVoucherCode } from '../interfaces/IVouchers';

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
    const allProductVouchers = await EstablishmentsProductsModel.findAll({
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

    return allProductVouchers;
  }

  // public static async changeVouchersReservedStatus(vouchersCodes1) {
  //   const t = await db.transaction();
  //   try {
  //     const vouchersCodes = await this.getVouchersByProductId();
  //     const updatedVouchersPromise = vouchersCodes.map(async (voucher) => {
  //       const { voucherCode, reservedStatus } = voucher;
  //       await VouchersAvailableModel.update(
  //         { reserved: reservedStatus },
  //         { where: { voucherCode }, transaction: t },
  //       );
  //     });
  //     Promise.all(updatedVouchersPromise);
  //     await t.commit();
  //   } catch {

  //   }
  // }
}
