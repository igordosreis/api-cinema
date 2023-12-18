/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import { IOrderRequestFormatted } from '../interfaces/IOrder';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CustomError, { productNotFound } from '../utils/customError.util';
import ordersUtil from '../utils/orders.util';

export default class VouchersService {
  public static async getVouchersByProductId(productId: number, transaction?: Transaction) {
    const product = await EstablishmentsProductsModel.findOne({
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
        {
          model: ProductsTypesModel,
          as: 'typeInfo',
        },
      ],
      transaction: transaction || null,
      where: { id: productId },
      order: [[{ model: VouchersAvailableModel, as: 'vouchersAvailable' }, 'expireAt', 'ASC']],
    });

    const isProductNotFound = !product;
    if (isProductNotFound) throw new CustomError(productNotFound);

    return product as IProductFromGetById;
  }

  public static async getRequestedVouchers(
    orderInfo: IOrderRequestFormatted[],
    transaction: Transaction,
  ) {
    const productsWithRequestedVouchersPromise: Promise<IProductWithRequestedVouchers>[] = orderInfo
      .map(async ({ productId, amountRequested }) => {
        const productPromise = await this.getVouchersByProductId(productId, transaction);
        ordersUtil.validateRequestedAmount(productPromise, amountRequested);

        const { vouchersAvailable, ...restOfInfo } = productPromise;
        const productInfo = {
          ...restOfInfo.dataValues,
          vouchersRequested: vouchersAvailable.slice(0, amountRequested),
        };

        return productInfo;
      });
    const productsWithRequestedVouchers = await Promise.all(productsWithRequestedVouchersPromise);

    return productsWithRequestedVouchers;
  }

  public static async updateVouchersOnCreateOrder(
    productsWithRequestedVouchers: IProductWithRequestedVouchers[],
    orderId: number,
    transaction: Transaction,
  ) {
    const vouchersUpdatedOrderIdPromise = productsWithRequestedVouchers.map(async (productInfo) => {
      const { vouchersRequested } = productInfo;

      const vouchersUpdatedPromise = vouchersRequested.map(async (voucher) => {
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
