import { Request, Response } from 'express';
import OrdersService from '../services/Orders.service';
import { IUserInfoInBody } from '../interfaces/IUser';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IOrderRequestRawBody } from '../interfaces/IOrder';
import { IPaginationRequest } from '../interfaces/IPagination';

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
    const paginationRequest = <IPaginationRequest>req.query;

    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    const allUserOrders = await OrdersService.getAllOrders({ userId, pagination });

    res.status(200).json(allUserOrders);
  }

  public static async getOrderById(req: Request, res: Response): Promise<void> {
    const { id: orderId } = req.params;
    const { userInfo } = <IUserInfoInBody>req.body;

    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch({ orderId, userInfo });

    const orderById = await OrdersService.getOrderById(orderSearchFormatted);

    res.status(200).json(orderById);
  }
}
