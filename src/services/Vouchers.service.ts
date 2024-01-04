/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable operator-linebreak */
/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import {
  IOrderRequestFormattedInfo,
  IParsedOrder,
  IParsedOrderWithProducts,
  IProductWithRequestedVouchersWithAmount,
  IProductsInOrder,
} from '../interfaces/IOrder';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CustomError, { productNotFound } from '../utils/customError.util';
import ordersUtil from '../utils/orders.util';
import PacksService from './Packs.service';
import { IVoucherAvailable } from '../interfaces/IVouchers';

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
    orderInfo: IOrderRequestFormattedInfo[],
    transaction: Transaction,
  ) {
    const parsedOrderPromise = orderInfo.map(async ({ productId, packId, amountRequested }) => {
      const isProduct = productId;
      if (isProduct) {
        return { productId, amountRequested };
      }

      const isPack = packId;
      if (isPack) {
        const pack = await PacksService.getPackSummaryById(packId);

        return { pack, amountRequested };
      }

      return [];
    });
    // Array with non-pack products' id and amount and packs' info and amount
    const parsedOrder: IParsedOrder[] = (await Promise.all(parsedOrderPromise)).flat();

    // Array with all products in current order
    const productsInOrder: IProductsInOrder[] = parsedOrder
      .map((orderItem) => {
        const isItemPack = orderItem.pack;
        if (isItemPack) {
          const { pack, amountRequested } = orderItem;

          const parsedPack = pack.packInfo.map(({ productId: id, quantity }) => ({
            productId: id,
            amountRequested: quantity * amountRequested,
          }));

          return parsedPack;
        }
        return orderItem;
      })
      .flat()
      // Merges duplicated products and adds the amountRequested
      .reduce((accProduct, currProduct) => {
        const prodIndex = accProduct.findIndex(
          (prodInAcc) => prodInAcc.productId === currProduct.productId,
        );
        if (prodIndex >= 0) {
          const newProdAmount = accProduct[prodIndex].amountRequested + currProduct.amountRequested;

          const newAcc = accProduct;
          newAcc[prodIndex].amountRequested = newProdAmount;

          return newAcc;
        }

        return [...accProduct, currProduct];
      }, [] as IProductsInOrder[]);

    const productsWithRequestedVouchersPromise: Promise<IProductWithRequestedVouchers>[] =
      productsInOrder.map(async (product) => {
        const { productId, amountRequested } = product;
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

    // Array with non-pack products' info and packs' info
    const parsedOrderWithProducts: IParsedOrderWithProducts[] = parsedOrder
      .map((orderItem) => {
        const isPack = orderItem.pack;
        if (isPack) return orderItem;

        const isProduct = orderItem.productId;
        if (isProduct) {
          const product = productsWithRequestedVouchers.filter(
            (productWithVouchers) => productWithVouchers.id === orderItem.productId,
          );

          const newProduct = product[0] as IProductWithRequestedVouchersWithAmount;
          newProduct.amountRequested = orderItem.amountRequested;

          return newProduct;
        }

        return [];
      })
      .flat();

    return { productsWithRequestedVouchers, parsedOrderWithProducts };
  }

  private static updateVouchers({
    vouchersToUpdate,
    orderId,
    price,
    transaction,
  }: {
    vouchersToUpdate: IVoucherAvailable[];
    orderId: number;
    price: number;
    transaction: Transaction;
  }) {
    vouchersToUpdate.forEach(async (voucher) => {
      const { voucherCode } = voucher;
      await VouchersAvailableModel.update(
        { orderId, soldPrice: price },
        { where: { voucherCode }, transaction },
      );
    });
  }

  public static async updateVouchersOnCreateOrder({
    productsWithRequestedVouchers,
    parsedOrderWithProducts,
    orderId,
    transaction,
  }: {
    productsWithRequestedVouchers: IProductWithRequestedVouchers[];
    parsedOrderWithProducts: IParsedOrderWithProducts[];
    orderId: number;
    transaction: Transaction;
  }) {
    productsWithRequestedVouchers.forEach((productWithVouchers) => {
      const { vouchersRequested, id: productIdWithVouchers } = productWithVouchers;
      
      parsedOrderWithProducts.reduce((accVouchers: IVoucherAvailable[], currItem) => {
        const isProduct = 'id' in currItem;
        if (isProduct) {
          const { id: productId, price, amountRequested } = currItem;

          const isSameProduct = productId === productIdWithVouchers;
          if (isSameProduct) {
            const vouchersToUpdate = accVouchers.slice(0, amountRequested);
            this.updateVouchers({
              vouchersToUpdate,
              orderId,
              price,
              transaction,
            });

            const vouchersRemaining = [...accVouchers].splice(amountRequested, accVouchers.length);

            return vouchersRemaining;
          }
        }

        const isPack = 'pack' in currItem;
        if (isPack) {
          const {
            pack: { packInfo },
            amountRequested,
          } = currItem;

          for (let index = 0; index < packInfo.length; index += 1) {
            const { productId, price, quantity } = packInfo[index];

            const isSameProduct = productId === productIdWithVouchers;
            if (isSameProduct) {
              const voucherAmountPerPack = amountRequested * quantity;
              const vouchersToUpdate = [...accVouchers].slice(0, voucherAmountPerPack);
              this.updateVouchers({
                vouchersToUpdate,
                orderId,
                price,
                transaction,
              });

              const vouchersRemaining = [...accVouchers].splice(
                voucherAmountPerPack,
                accVouchers.length,
              );

              return vouchersRemaining;
            }
          }
        }

        return accVouchers;
      }, vouchersRequested);
    });
  }
}
