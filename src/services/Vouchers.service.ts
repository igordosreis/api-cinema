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
  IProductsInOrder,
} from '../interfaces/IOrder';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CustomError, { productNotFound } from '../utils/customError.util';
import ordersUtil from '../utils/orders.util';
import PacksService from './Packs.service';

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
    // const parsedOrderPromise = orderInfo
    //   .reduce(async (prodAccPromise: Promise<IOrderRequestFormattedInfo[]>, currProd) => {
    //     const { productId, packId, amountRequested } = currProd;
    //     const prodAcc = await prodAccPromise;
    //     const isProduct = productId;
    //     if (isProduct) {
    //       return [...prodAcc, { productId, amountRequested }];
    //     }

    //     const isPack = packId;
    //     if (isPack) {
    //       const { packInfo } = await PacksService.getPackSummaryById(packId);

    //       const parsedPack: IOrderRequestFormattedInfo[] = packInfo
    //         .map(({ productId: id, quantity, price }) => ({
    //           productId: id,
    //           amountRequested: quantity * amountRequested,
    //           price,
    //         }));

    //       return [...prodAcc, ...parsedPack];
    //     }

    //     return prodAcc;
    //   }, Promise.resolve([] as IOrderRequestFormattedInfo[]));
    // const flattenedOrder = (await Promise.resolve(parsedOrderPromise));

    // const parsedOrderPromise = orderInfo.map(async ({ productId, packId, amountRequested }) => {
    //   const isProduct = productId;
    //   if (isProduct) {
    //     return { productId, amountRequested };
    //   }

    //   const isPack = packId;
    //   if (isPack) {
    //     const { packInfo } = await PacksService.getPackSummaryById(packId);

    //     const parsedPack = packInfo.map(({ productId: id, quantity, price }) => ({
    //       productId: id,
    //       amountRequested: quantity * amountRequested,
    //       price,
    //     }));

    //     return parsedPack;
    //   }

    //   return [];
    // });
    // const flattenedOrder = (await Promise.all(parsedOrderPromise)).flat();

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
    // array with non-pack products and packs' info
    const parsedOrder: IParsedOrder[] = (await Promise.all(parsedOrderPromise)).flat();

    // array with all products in order
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
      // merges duplicated products and adds the amountRequested
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
    
    console.log('- -- - -- -- - -- - -- -- - -- - -- -- productsInOrder:    ', productsInOrder);
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

    // array with non-pack products' info and packs' info
    const parsedOrderWithProducts: IParsedOrderWithProducts[] = parsedOrder
      .map((orderItem) => {
        const isPack = orderItem.pack;
        if (isPack) return orderItem;

        const isProduct = orderItem.productId;
        if (isProduct) {
          const product = productsWithRequestedVouchers.filter(
            (productWithVouchers) => productWithVouchers.id === orderItem.productId,
          );

          const newProduct = product;
          newProduct[0].amountRequested = orderItem.amountRequested;

          return newProduct;
        }

        return [];
      })
      .flat();

    return { productsWithRequestedVouchers, parsedOrderWithProducts };
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
