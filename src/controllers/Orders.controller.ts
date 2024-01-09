import { Request, Response } from 'express';
import OrdersService from '../services/Orders.service';
import { IUserInfo } from '../interfaces/IUser';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IOrderRequestRawBody } from '../interfaces/IOrder';

export default class OrdersController {
  public static async createOrder(req: Request, res: Response): Promise<void> {
    const orderRequest = <IOrderRequestRawBody>req.body;
    const formattedRequest = formatRequestQueryUtil.formatCreateOrder(orderRequest);
    
    const createOrderResponse = await OrdersService.createOrder(formattedRequest);

    res.status(200).json(createOrderResponse);
  }

  public static async cancelOrder(req: Request, res: Response): Promise<void> {
    const { id: orderId } = req.params;
    const userInfo = <IUserInfo>req.body;

    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch({ orderId, userInfo });

    await OrdersService.cancelOrder(orderSearchFormatted);

    res.status(200).end();
  }

  public static async getAllOrders(req: Request, res: Response): Promise<void> {
    const {
      user: { id: userId },
    }: IUserInfo = req.body.userInfo;

    const allUserOrders = await OrdersService.getAllOrders(userId);

    res.status(200).json(allUserOrders);
  }

  public static async getOrderById(req: Request, res: Response): Promise<void> {
    const { id: orderId } = req.params;
    const userInfo = <IUserInfo>req.body;

    const orderSearchFormatted = formatRequestQueryUtil.formatOrderSearch({ orderId, userInfo });

    const orderById = await OrdersService.getOrderById(orderSearchFormatted);

    res.status(200).json(orderById);
  }
}
