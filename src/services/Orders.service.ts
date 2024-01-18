/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
import { Transaction } from 'sequelize';
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
} from '../interfaces/IOrder';
import { CONSOLE_LOG_ERROR_TITLE, STATUS_CANCELLED, STATUS_WAITING } from '../constants';
import VouchersService from './Vouchers.service';
import OrdersPacksModel from '../database/models/OrdersPacks.model';
import { IPagination } from '../interfaces/IPagination';
import PacksModel from '../database/models/Packs.model';

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
      const { userId, cinemaPlan, orderInfo } = orderRequest;

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

      const { totalPrice, totalUnits } = orderTotals;
      const { id: orderId } = await OrdersModel.create(
        { totalPrice, totalUnits, expireAt, userId },
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
        orderId,
        userId,
        value: orderTotals.totalPrice.toString(),
        expireAt,
      };
      const paymentOrderResponse = await paymentUtil.createPayment(paymentOrderRequest);
      const { id: paymentId, paymentModules } = paymentOrderResponse;

      await OrdersModel.update({ paymentId }, { where: { id: orderId }, transaction: t });

      await t.commit();

      return { orderId, paymentId, paymentModules };
    } catch (error: CustomError | unknown) {
      await t.rollback();

      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - -- - - - -error: ', error);
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
        { status: status || STATUS_CANCELLED },
        { where: { id: orderId, userId }, transaction: t },
      );

      const isPackInOrder = packDetails.length > 0;
      if (isPackInOrder) {
        const packsToUpdatePromise = packDetails.map(async (pack) => {
          const {
            packOrder: { limited },
            packId,
            quantity,
          } = pack;

          if (limited) {
            const packToUpdate = await PacksModel.findOne({ where: { packId } });

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
  }: {
    userId: number;
    pagination: IPagination;
  }) {
    try {
      const allUserOrders = await OrdersModel.findAll({
        include: [
          {
            model: VouchersAvailableModel,
            as: 'vouchersOrderUnpaid',
            required: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'voucherCode'],
            },
          },
          {
            model: VouchersUserModel,
            as: 'vouchersOrderPaid',
            required: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
            include: [
              {
                model: EstablishmentsProductsModel,
                as: 'productVoucherInfo',
                attributes: {
                  exclude: ['id'],
                },
              },
            ],
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
        ],
        where: { userId },
        limit,
        offset: page * limit,
      });

      const areOrdersNotFound = !allUserOrders;
      if (areOrdersNotFound) throw new CustomError(ordersNotFound);

      return allUserOrders;
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
}
