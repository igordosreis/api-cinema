import { Request, Response } from 'express';
import OrdersService from '../services/Orders.service';
import { IUserInfo } from '../interfaces/IUser';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IOrderRequestRawBody } from '../interfaces/IVouchers';
import { IOrderSearchRaw } from '../interfaces/IOrder';

export default class UsersController {
  public static async getAllOrders(req: Request, res: Response): Promise<void> {
    const {
      user: { id: userId },
    }: IUserInfo = req.body.userInfo;

    const allUserOrders = await OrdersService.getAllOrders(userId);

    res.status(200).json(allUserOrders);
  }

  public static async createOrder(req: Request, res: Response): Promise<void> {
    const orderRequest = req as IOrderRequestRawBody;
    const formattedRequest = formatRequestQueryUtil.formatCreateOrder(orderRequest);

    const createOrderResponse = await OrdersService.createOrder(formattedRequest);

    res.status(200).json(createOrderResponse);
  }

  public static async cancelOrder(req: Request, res: Response): Promise<void> {
    const orderSearchRaw = req as unknown as IOrderSearchRaw;
    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch(orderSearchRaw);

    await OrdersService.cancelOrder(orderSearchFormatted);

    res.status(200).end();
  }

  public static async getOrderById(req: Request, res: Response): Promise<void> {
    const orderSearchRaw = req as unknown as IOrderSearchRaw;
    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch(orderSearchRaw);

    const orderById = await OrdersService.getOrderById(orderSearchFormatted);

    res.status(200).json(orderById);
  }
}
