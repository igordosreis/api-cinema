import { Request, Response } from 'express';
import { IUserInfoInBody } from '../interfaces/IUser';
import { CartService } from '../services';
import { ICartAddSchema, ICartAddRequest } from '../interfaces/ICart';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

export default class CartController {
  public static async getCart(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id },
      },
    } = <IUserInfoInBody>req.body;

    const userId = Number(id);

    const currentCart = await CartService.getCart(userId);

    res.status(200).json(currentCart);
  }

  // public static async cartAdd(req: Request, res: Response): Promise<void> {
  //   const cartAddRequest = <ICartAddRequest>req.query;
  //   const { userInfo } = <IUserInfoInBody>req.body;

  //   const formattedRequest = formatRequestQueryUtil.formatCartAddRequest(cartAddRequest, userInfo);
  //   ICartAddSchema.parse(formattedRequest);

  //   const currentCart = await CartService.cartAddSingle(formattedRequest);

  //   res.status(200).json(currentCart);
  // }

  public static async addToCart(req: Request, res: Response): Promise<void> {
    const cartInfoRequest = <ICartAddRequest>req.body;

    const cartAddInfo = formatRequestQueryUtil.formatCartAddRequest(cartInfoRequest);
    ICartAddSchema.parse(cartAddInfo);

    CartService.addToCart(cartAddInfo);

    res.status(200).end();
  }
}
