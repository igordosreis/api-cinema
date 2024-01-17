import { Request, Response } from 'express';
import { IUserInfoInBody } from '../interfaces/IUser';
import { CartService } from '../services';
import {
  ICartOperationSchema,
  ICartOperationRequest,
  ICartOperationRequestSchema,
} from '../interfaces/ICart';
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
    const cartOperationRequest = <ICartOperationRequest>req.query;
    const { userInfo } = <IUserInfoInBody>req.body;

    ICartOperationRequestSchema.parse(cartOperationRequest);

    const cartOperationInfo = formatRequestQueryUtil.formatOperationRequest(
      cartOperationRequest,
      userInfo,
    );
    ICartOperationSchema.parse(cartOperationInfo);

    const currentCart = await CartService.addToCart(cartOperationInfo);

    res.status(200).json(currentCart);
  }

  public static async removeFromCart(req: Request, res: Response): Promise<void> {
    const cartOperationRequest = <ICartOperationRequest>req.query;
    const { userInfo } = <IUserInfoInBody>req.body;

    ICartOperationRequestSchema.parse(cartOperationRequest);

    const cartOperationInfo = formatRequestQueryUtil.formatOperationRequest(
      cartOperationRequest,
      userInfo,
    );
    ICartOperationSchema.parse(cartOperationInfo);

    const currentCart = await CartService.removeFromCart(cartOperationInfo);

    res.status(200).json(currentCart);
  }

  public static async deleteFromCart(req: Request, res: Response): Promise<void> {
    const cartOperationRequest = <ICartOperationRequest>req.query;
    const { userInfo } = <IUserInfoInBody>req.body;

    ICartOperationRequestSchema.parse(cartOperationRequest);

    const cartOperationInfo = formatRequestQueryUtil.formatOperationRequest(
      cartOperationRequest,
      userInfo,
    );
    ICartOperationSchema.parse(cartOperationInfo);

    const currentCart = await CartService.deleteFromCart(cartOperationInfo);

    res.status(200).json(currentCart);
  }

  public static async deleteAllCart(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id },
      },
    } = <IUserInfoInBody>req.body;

    const userId = Number(id);
    await CartService.deleteAllCart(userId);

    res.status(200).end();
  }

  // public static async addToCart(req: Request, res: Response): Promise<void> {
  //   const cartInfoRequest = <ICartAddRequest>req.body;

  //   const cartAddInfo = formatRequestQueryUtil.formatCartAddRequest(cartInfoRequest);
  //   ICartAddSchema.parse(cartAddInfo);

  //   CartService.addToCart(cartAddInfo);

  //   res.status(200).end();
  // }
}
