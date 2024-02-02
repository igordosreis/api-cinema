import { Request, Response } from 'express';
import OrdersService from '../services/Orders.service';
import { IUserInfoInBody } from '../interfaces/IUser';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import {
  IOrderAllRequest,
  IOrderAllRequestSchema,
  IOrderRequestRawBody, 
} from '../interfaces/IOrder';
import dateUtils from '../utils/date.utils';

export default class OrdersController {
  public static async createOrder(req: Request, res: Response): Promise<void> {
    const orderRequest = <IOrderRequestRawBody>req.body;
    const formattedRequest = formatRequestQueryUtil.formatCreateOrder(orderRequest);

    const createOrderResponse = await OrdersService.createOrder(formattedRequest);

    res.status(200).json(createOrderResponse);
  }

  public static async cancelOrder(req: Request, res: Response): Promise<void> {
    const { id: orderId } = req.params;
    const { userInfo } = <IUserInfoInBody>req.body;

    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch({ orderId, userInfo });

    await OrdersService.cancelOrder(orderSearchFormatted);

    res.status(200).end();
  }

  public static async getAllOrders(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id: userId },
      },
    } = <IUserInfoInBody>req.body;
    const { page, limit, year, month } = <IOrderAllRequest>req.query;
    IOrderAllRequestSchema.parse({ page, limit, year, month });

    const paginationRequest = { page, limit };
    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);

    const { firstDay, lastDay } = dateUtils.getFirstAndLastOfMonth({ year, month });

    const allUserOrders = await OrdersService.getAllOrders({
      userId,
      pagination,
      firstDay,
      lastDay,
    });

    res.status(200).json(allUserOrders);
  }

  public static async getOrderById(req: Request, res: Response): Promise<void> {
    const { id: orderId } = req.params;
    const { userInfo } = <IUserInfoInBody>req.body;

    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch({ orderId, userInfo });

    const orderById = await OrdersService.getOrderById(orderSearchFormatted);

    res.status(200).json(orderById);
  }

  public static async verifyOrders(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id },
      },
    } = <IUserInfoInBody>req.body;

    const userId = Number(id);
    await OrdersService.verifyOrders(userId);

    res.status(200).end();
  }
}
