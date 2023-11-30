import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';

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
          where: { reserved: 0 },
        },
      ],
      where: { id: productId },
      order: [[{ model: VouchersAvailableModel, as: 'vouchersAvailable' }, 'expireDate', 'ASC']],
    });

    return allProductVouchers;
  }
}
