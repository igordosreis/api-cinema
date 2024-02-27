/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import OrdersProductsModel from '../database/models/OrdersProducts.model';
import { IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CustomError, {
  cancelUnauthorized,
  orderNotFound,
  orderServiceUnavailable,
  ordersNotFound,
} from '../utils/customError.util';
import ordersUtil from '../utils/orders.util';
import OrdersModel from '../database/models/Orders.model';
import dateUtils from '../utils/date.utils';
import paymentUtil from '../utils/payment.util';
import { IPaymentOrderRequest } from '../interfaces/IPayment';
import {
  IOrderInfo,
  IOrderSearchFormatted,
  IOrderRequestBody,
  IParsedOrderWithProducts,
  IOrderUpdate,
  IOrderAll,
  // VoucherInfo,
  // IProductTypes,
  ICurrVoucher,
  IVouchersByType,
  IVoucherInfo,
  IOrderStatus,
} from '../interfaces/IOrder';
import { CONSOLE_LOG_ERROR_TITLE, STATUS_CANCELED, STATUS_WAITING } from '../constants';
import VouchersService from './Vouchers.service';
import OrdersPacksModel from '../database/models/OrdersPacks.model';
import { IPagination } from '../interfaces/IPagination';
import PacksModel from '../database/models/Packs.model';
import EstablishmentsModel from '../database/models/Establishments.model';
import EstablishmentsImagesModel from '../database/models/EstablishmentsImages.model';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import ImageFormatter from '../utils/formatImages.util';
import CartModel from '../database/models/Cart.model';

export default class OrdersService {
  private static async createPacksOrder(
    parsedOrderWithProducts: IParsedOrderWithProducts[],
    orderId: number,
    transaction: Transaction,
  ) {
    const packsOrderPromise = parsedOrderWithProducts.map(async (itemInfo) => {
      const isPack = 'pack' in itemInfo;
      if (isPack) {
        const {
          pack: { packId, price, limited, counter },
          amountRequested,
        } = itemInfo;

        const packOrderPromise = await OrdersPacksModel.create(
          { orderId, packId, quantity: amountRequested, soldPrice: price },
          { transaction },
        );

        if (limited) {
          const newCounter = counter + amountRequested;

          PacksModel.update({ counter: newCounter }, { where: { packId }, transaction });
        }

        return packOrderPromise;
      }
    });

    await Promise.all(packsOrderPromise);
  }

  private static async createProductsOrder(
    productsWithRequestedVouchers: IProductWithRequestedVouchers[],
    orderId: number,
    transaction: Transaction,
  ) {
    const productsOrderPromise = productsWithRequestedVouchers.map(async (productInfo) => {
      const { productId, price, vouchersRequested } = productInfo;
      const productOrderPromise = await OrdersProductsModel.create(
        { orderId, productId, soldPrice: price, quantity: vouchersRequested.length },
        { transaction },
      );

      return productOrderPromise;
    });

    await Promise.all(productsOrderPromise);
  }

  public static async createOrder(orderRequest: IOrderRequestBody) {
    const t = await db.transaction();
    try {
      const { userId, cinemaPlan } = orderRequest;

      await ordersUtil.verifyIfAllOrdersAreFinalized({ userId, transaction: t });

      const orderInfo = await ordersUtil.getCartFormatted(userId);

      const {
        productsWithRequestedVouchers,
        parsedOrderWithProducts,
      } = await VouchersService.getRequestedVouchers(orderInfo, t);

      const orderTotals = ordersUtil.calculateOrderTotals(
        productsWithRequestedVouchers,
        parsedOrderWithProducts,
      );
      await ordersUtil.validatePlanAmount({ userId, cinemaPlan, orderTotals });

      const currentDate = new Date();
      const expireAt = dateUtils.addFiveMinutes(currentDate);

      const { establishmentId } = orderInfo[0];
      const { totalPrice, totalUnits } = orderTotals;
      const { id: orderId } = await OrdersModel.create(
        { totalPrice, totalUnits, expireAt, userId, establishmentId },
        { transaction: t },
      );

      // Promise.all
      await this.createProductsOrder(productsWithRequestedVouchers, orderId, t);
      await this.createPacksOrder(parsedOrderWithProducts, orderId, t);
      await VouchersService.updateVouchersOnCreateOrder({
        productsWithRequestedVouchers,
        parsedOrderWithProducts,
        orderId,
        transaction: t,
      });

      const paymentOrderRequest: Omit<IPaymentOrderRequest, 'webhook' | 'name'> = {
        establishmentId,
        orderId,
        userId,
        value: orderTotals.totalPrice.toString(),
        expireAt,
      };
      const paymentOrderResponse = await paymentUtil.createPayment(paymentOrderRequest);
      const { id: paymentId, paymentModules } = paymentOrderResponse;

      await OrdersModel.update({ paymentId }, { where: { id: orderId }, transaction: t });

      // Save cart after createOrder
      // await CartModel.update({ waiting: true }, { where: { userId }, transaction: t });

      // Empty cart after createOrder
      await CartModel.destroy({ where: { userId } });

      await t.commit();

      return { orderId, paymentId, paymentModules };
    } catch (error: CustomError | unknown) {
      await t.rollback();

      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(orderServiceUnavailable);
    }
  }

  public static async cancelOrder({ orderId, userId, status }: IOrderUpdate) {
    const t = await db.transaction();
    try {
      const { status: statusFromOrder, packDetails } = await this.getOrderById({
        orderId,
        userId,
        transaction: t,
      });
      if (statusFromOrder !== STATUS_WAITING) throw new CustomError(cancelUnauthorized);

      await VouchersAvailableModel.update(
        { orderId: null, soldPrice: null },
        { where: { orderId }, transaction: t },
      );

      await OrdersModel.update(
        { status: status || STATUS_CANCELED },
        { where: { id: orderId, userId }, transaction: t },
      );
      
      // Restore cart after cancelOrder
      // await CartModel.update(
      //   { waiting: false },
      //   { where: { userId, waiting: true }, transaction: t },
      // );

      const isPackInOrder = packDetails.length > 0;
      if (isPackInOrder) {
        const packsToUpdatePromise = packDetails.map(async (pack) => {
          const {
            packOrder: { limited },
            packId,
            quantity,
          } = pack;

          if (limited) {
            const packToUpdate = await PacksModel.findOne({ where: { packId }, transaction: t });

            if (packToUpdate) {
              const { counter } = packToUpdate;
              const newCounter = counter - quantity;

              const packUpdated = await PacksModel.update(
                { counter: newCounter },
                { where: { packId }, transaction: t },
              );

              return packUpdated;
            }
          }
        });

        await Promise.all(packsToUpdatePromise);
      }

      await t.commit();
    } catch (error: CustomError | unknown) {
      await t.rollback();

      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(orderServiceUnavailable);
    }
  }

  public static async getAllOrders({
    userId,
    pagination: { page, limit },
    firstDay,
    lastDay,
    status,
  }: {
    userId: number;
    pagination: IPagination;
    firstDay: string;
    lastDay: string;
    status: IOrderStatus | undefined;
  }) {
    try {
      const statusFilter = status === undefined || status === 'all'
        ? {}
        : { status };
        
      const allUserOrders = await OrdersModel.findAll({
        include: [
          {
            model: EstablishmentsModel,
            as: 'establishmentInfo',
            include: [
              {
                model: EstablishmentsImagesModel,
                as: 'images',
                attributes: {
                  exclude: [
                    'establishmentId',
                    'imageCarousel',
                    'resizeColor',
                    'createdAt',
                    'updatedAt',
                  ],
                },
              },
            ],
            attributes: {
              exclude: [
                'about',
                'link',
                'linkDescription',
                'telephone',
                'telephoneTwo',
                'whatsapp',
                'instagram',
                'site',
                'rules',
                'keyWords',
                'active',
                'createdAt',
                'updatedAt',
                'views',
                'underHighlight',
              ],
            },
          },
          // {
          //   model: VouchersAvailableModel,
          //   as: 'vouchersOrderUnpaid',
          //   required: false,
          //   attributes: {
          //     exclude: ['createdAt', 'updatedAt', 'voucherCode'],
          //   },
          // },
          {
            model: VouchersUserModel,
            as: 'vouchersOrderPaid',
            required: false,
            attributes: {
              exclude: [
                'createdAt',
                'updatedAt',
                'soldAt',
                'productId',
                'orderId',
              ],
            },
            include: [
              {
                model: EstablishmentsProductsModel,
                as: 'productVoucherInfo',
                attributes: {
                  exclude: [
                    'establishmentId',
                    'active',
                    'purchasable', 
                    'description',
                    'rules',
                    'image',
                    'createdAt',
                    'updatedAt',
                    'expireAt',
                    'soldOutAmount',
                    'type',
                  ],
                },
                include: [
                  {
                    model: ProductsTypesModel,
                    as: 'typeInfo',
                    attributes: {
                      exclude: [
                        'createdAt',
                        'updatedAt',
                      ],
                    },
                  },
                ],
              },
            ],
          },
          // {
          //   model: OrdersProductsModel,
          //   as: 'productsDetails',
          //   required: false,
          //   attributes: {
          //     exclude: ['orderId'],
          //   },
          //   include: [
          //     {
          //       model: EstablishmentsProductsModel,
          //       as: 'productInfo',
          //       attributes: {
          //         exclude: ['id'],
          //       },
          //     },
          //   ],
          // },
        ],
        attributes: {
          exclude: [
            'userId',
            'totalUnits',
            'establishmentId',
            'expireAt',
            'establishmentId',
          ],
        },
        where: {
          userId,
          updatedAt: {
            [Op.gte]: firstDay,
            [Op.lte]: lastDay,
          },
          ...statusFilter,
        },
        order: [['updatedAt', 'DESC']],
        limit,
        offset: page * limit,
      }) as IOrderAll[];

      const allUserOrdersParsed = allUserOrders.map((currOrder) => {
        const { vouchersOrderPaid, establishmentInfo, ...restOfOrderInfo } = currOrder.toJSON();
        // Remove Sequelize-specific properties
        delete restOfOrderInfo.include;
        delete restOfOrderInfo.parent;
        
        const vouchersByType = vouchersOrderPaid
          .reduce((accByType: IVouchersByType[], currVoucher: ICurrVoucher) => {
            const { productVoucherInfo, ...restOfVoucherInfo } = currVoucher;
            const { typeInfo, ...restOfProductInfo } = productVoucherInfo;
            const { name, icon } = typeInfo;

            const typeObjInAccIndex = accByType
              .findIndex(({ typeInfo: { name: typeName } }) => typeName === name);

            const isTypeInAcc = typeObjInAccIndex > -1;
            if (isTypeInAcc) {
              const newTypeObj = accByType[typeObjInAccIndex];

              const newVoucher = {
                ...restOfVoucherInfo,
                productVoucherInfo: {
                  ...restOfProductInfo,
                },
              } as IVoucherInfo;
              newTypeObj.vouchersInfo.push(newVoucher);

              const newAccByType = [...accByType];
              newAccByType[typeObjInAccIndex] = {
                ...newTypeObj,
              };

              return newAccByType;
            }

            const newVoucher = {
              ...restOfVoucherInfo,
              productVoucherInfo: {
                ...restOfProductInfo,
              },
            };

            const newTypeObj = {
              vouchersInfo: [newVoucher],
              typeInfo: {
                ...typeInfo,
                icon: ImageFormatter.formatUrl({ imageName: icon, folderPath: '/product-types' }),
              },
            };

            const newAccByType = [...accByType, newTypeObj];

            return newAccByType;
          }, [] as IVouchersByType[]);

        const { images: { logo, cover } } = establishmentInfo;
    
        return {
          ...restOfOrderInfo,
          vouchersByType,
          establishmentInfo: {
            ...establishmentInfo,
            images: {
              logo: ImageFormatter.formatUrl({
                imageName: logo,
                folderPath: '/establishments/logo',
              }),
              cover: ImageFormatter.formatUrl({
                imageName: cover,
                folderPath: '/establishments/cover',
              }),
            },
          },
        };
      });
      // const allUserOrdersParsed = allUserOrders.map((currOrder) => {
      //   const { vouchersOrderPaid, ...restOfOrderInfo } = currOrder.toJSON();
      //   // Remove Sequelize-specific properties
      //   delete restOfOrderInfo.include;
      //   delete restOfOrderInfo.parent;
        
      //   const vouchersInfo = vouchersOrderPaid.reduce(
      //     (accType: VoucherInfo<IProductTypes>, currVoucher: ICurrVoucher) => {
      //       const {
      //         productVoucherInfo: {
      //           typeInfo: { name },
      //         },
      //       } = currVoucher;

      //       const typedName = name as IProductTypes;

      //       const newAccType = {
      //         ...accType,
      //         [typedName]: accType[typedName]
      //           ? [...accType[typedName], currVoucher]
      //           : [currVoucher],
      //       };

      //       return newAccType;
      //     },
      //     {} as VoucherInfo<IProductTypes>,
      //   );
    
      //   return { ...restOfOrderInfo, vouchersInfo };
      // });

      const areOrdersNotFound = !allUserOrders;
      if (areOrdersNotFound) throw new CustomError(ordersNotFound);

      return allUserOrdersParsed;
    } catch (error: CustomError | unknown) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(orderServiceUnavailable);
    }
  }

  public static async getOrderById({
    orderId,
    userId,
    transaction,
    isAdmin,
  }: IOrderSearchFormatted) {
    try {
      const attributes = isAdmin
        ? { exclude: ['createdAt', 'updatedAt'] }
        : { exclude: ['createdAt', 'updatedAt', 'voucherCode'] };

      const orderInfo = await OrdersModel.findOne({
        include: [
          {
            model: EstablishmentsModel,
            as: 'establishmentInfo',
            include: [
              {
                model: EstablishmentsImagesModel,
                as: 'images',
              },
            ],
          },
          {
            model: VouchersAvailableModel,
            as: 'vouchersOrderUnpaid',
            where: {
              orderId,
            },
            required: false,
            attributes,
          },
          {
            model: VouchersUserModel,
            as: 'vouchersOrderPaid',
            where: {
              orderId,
            },
            required: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
          },
          {
            model: OrdersProductsModel,
            as: 'productsDetails',
            required: false,
            attributes: {
              exclude: ['orderId'],
            },
            include: [
              {
                model: EstablishmentsProductsModel,
                as: 'productInfo',
                attributes: {
                  exclude: ['id'],
                },
              },
            ],
          },
          {
            model: OrdersPacksModel,
            as: 'packDetails',
            required: false,
            attributes: {
              exclude: ['orderId'],
            },
            include: [
              {
                model: PacksModel,
                as: 'packOrder',
                attributes: {
                  exclude: ['counter', 'counterLimit'],
                },
              },
            ],
          },
        ],
        where: { id: orderId, userId },
        order: [['createdAt', 'ASC']],
        transaction,
      });

      const isOrderNotFound = !orderInfo;
      if (isOrderNotFound) throw new CustomError(orderNotFound);

      return orderInfo as IOrderInfo;
    } catch (error: CustomError | unknown) {
      if (error instanceof CustomError) throw error;

      throw new CustomError(orderServiceUnavailable);
    }
  }

  public static async verifyOrders(userId: number) {
    ordersUtil.verifyIfAllOrdersAreFinalized({ userId });
  }
}
