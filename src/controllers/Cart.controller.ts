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

  public static async addToCart(req: Request, res: Response): Promise<void> {
    const cartAddRequest = <ICartAddRequest>req.query;
    console.log('--- - - - -       -------        ------ cartAddRequest:       ', cartAddRequest);
    const { userInfo } = <IUserInfoInBody>req.body;

    const cartAddInfo = formatRequestQueryUtil.formatCartAddRequest(cartAddRequest, userInfo);
    ICartAddSchema.parse(cartAddInfo);

    const currentCart = await CartService.addToCart(cartAddInfo);

    res.status(200).json(currentCart);
  }

  // public static async addToCart(req: Request, res: Response): Promise<void> {
  //   const cartInfoRequest = <ICartAddRequest>req.body;

  //   const cartAddInfo = formatRequestQueryUtil.formatCartAddRequest(cartInfoRequest);
  //   ICartAddSchema.parse(cartAddInfo);

  //   CartService.addToCart(cartAddInfo);

  //   res.status(200).end();
  // }
}
