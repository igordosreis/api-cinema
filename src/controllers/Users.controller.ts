import { Request, Response } from 'express';
import UsersService from '../services/Users.service';
import { IUserInfo } from '../interfaces/IUser';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import { IOrderRequestRawBody } from '../interfaces/IVouchers';

export default class UsersController {
  public static async getUserVoucherHistory(req: Request, res: Response): Promise<void> {
    const {
      user: { id: userId },
    }: IUserInfo = req.body.userInfo;

    const userVoucherHistory = await UsersService.getUserVoucherHistory(userId);

    res.status(200).json(userVoucherHistory);
  }

  public static async getVouchersByProductId(req: Request, res: Response): Promise<void> {
    const { productId } = req.query;

    const parsedProductId = Number(productId);
    const userVoucherHistory = await UsersService.getVouchersByProductId(parsedProductId);

    res.status(200).json(userVoucherHistory);
  }

  public static async createOrder(req: Request, res: Response): Promise<void> {
    const orderRequest = req as IOrderRequestRawBody;
    const formattedRequest = formatRequestQueryUtil.formatCreateOrder(orderRequest);

    const createOrderResponse = await UsersService.createOrder(formattedRequest);

    res.status(200).json(createOrderResponse);
  }
}
