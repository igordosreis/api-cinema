/* eslint-disable max-lines-per-function */
import { Transaction, Op } from 'sequelize';
import db from '../database/models';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import VouchersUserModel from '../database/models/VouchersUser.model';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
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
  IOrderRequestFormatted,
  IOrderRequestFormattedBody,
} from '../interfaces/IOrder';
import { STATUS_CANCELLED, STATUS_WAITING } from '../constants';
import OrdersProductsModel from '../database/models/OrdersProducts.model';

export default class OrdersService {
  private static async getVouchersByProductId(productId: number, transaction?: Transaction) {
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
      ],
      transaction: transaction || null,
      where: { id: productId },
      order: [[{ model: VouchersAvailableModel, as: 'vouchersAvailable' }, 'expireAt', 'ASC']],
    });

    return product as IProductFromGetById;
  }

  private static async getProductsWithRequestedVouchers(
    orderInfo: IOrderRequestFormatted[],
    transaction: Transaction,
  ) {
    const productsWithRequestedVouchersPromise: Promise<IProductWithRequestedVouchers>[] = orderInfo
      .map(async ({ productId, amountRequested }) => {
        const productPromise = await this.getVouchersByProductId(productId, transaction);
        ordersUtil.validateOrderAmount(productPromise, amountRequested);

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

  private static async updateVouchersOnCreateOrder(
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

  private static async createProductsOrder(
    productsWithRequestedVouchers: IProductWithRequestedVouchers[],
    orderId: number,
    transaction: Transaction,
  ) {
    const productsOrderPromise = productsWithRequestedVouchers.map(async (productInfo) => {
      const { id, price, vouchersRequested } = productInfo;
      const productOrderPromise = await OrdersProductsModel.create(
        { orderId, productId: id, soldPrice: price, quantity: vouchersRequested.length },
        { transaction },
      );

      return productOrderPromise;
    });

    await Promise.all(productsOrderPromise);
  }

  public static async createOrder(orderRequest: IOrderRequestFormattedBody) {
    const t = await db.transaction();
    try {
      const { userId, cinemaPlan, orderInfo } = orderRequest;

      const productsWithRequestedVouchers = await this.getProductsWithRequestedVouchers(
        orderInfo,
        t,
      );

      const orderTotals = ordersUtil.calculateOrderTotals(productsWithRequestedVouchers);

      await ordersUtil.validatePlanAmount({ userId, cinemaPlan, orderTotals });

      const currentDate = new Date();
      const expireAt = dateUtils.addFiveMinutes(currentDate);

      const { id: orderId } = await OrdersModel.create(
        { ...orderTotals, expireAt, userId },
        { transaction: t },
      );

      await this.createProductsOrder(productsWithRequestedVouchers, orderId, t);
      await this.updateVouchersOnCreateOrder(productsWithRequestedVouchers, orderId, t);

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

      console.log('- -- - -- -- -- - - --  - - -- - -- - ---- -- -- - -- - - - -error: ', error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(orderServiceUnavailable);
    }
  }

  public static async cancelOrder({ orderId, userId }: IOrderSearchFormatted) {
    const t = await db.transaction();
    try {
      const { status } = await this.getOrderById({ orderId, userId, transaction: t });
      if (status !== STATUS_WAITING) throw new CustomError(cancelUnauthorized);

      await VouchersAvailableModel.update(
        { orderId: null, soldPrice: null },
        { where: { orderId }, transaction: t },
      );

      await OrdersModel.update(
        { status: STATUS_CANCELLED },
        { where: { id: orderId, userId }, transaction: t },
      );

      await t.commit();
    } catch (error: CustomError | unknown) {
      await t.rollback();

      console.log('- -- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);
      if (error instanceof CustomError) throw error;

      throw new CustomError(orderServiceUnavailable);
    }
  }

  public static async getAllOrders(userId: number) {
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
      });
      
      // const allUserOrdersWithProducts = allUserOrdersWithVouchers.order
      // const allUserOrders = await OrdersModel.findAll({
      //   include: [
      //     {
      //       model: VouchersAvailableModel,
      //       as: 'vouchersOrderUnpaid',
      //       required: false,
      //       attributes: {
      //         exclude: ['createdAt', 'updatedAt', 'voucherCode'],
      //       },
      //     },
      //     {
      //       model: VouchersUserModel,
      //       as: 'vouchersOrderPaid',
      //       required: false,
      //       attributes: {
      //         exclude: ['createdAt', 'updatedAt'],
      //       },
      //     },
      //     {
      //       model: OrdersProductsModel,
      //       as: 'productsInOrder',
      //     },
      //   ],
      //   where: { userId },
      // });

      const areOrdersNotFound = !allUserOrders;
      if (areOrdersNotFound) throw new CustomError(ordersNotFound);

      return allUserOrders;
    } catch (error: CustomError | unknown) {
      console.log('- -- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);
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
