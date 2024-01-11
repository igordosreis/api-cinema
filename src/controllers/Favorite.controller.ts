import { Request, Response } from 'express';
import { IUserInfoInBody } from '../interfaces/IUser';
import { FavoritesService } from '../services';
import { IPaginationRequest } from '../interfaces/IPagination';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

export default class FavoritesController {
  public static async toggleFavoriteEstablishment(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id: userId },
      },
    } = <IUserInfoInBody>req.body;
    const { id: addressId } = req.params;

    await FavoritesService.toggleFavoriteEstablishment({
      userId,
      addressId: Number(addressId),
    });

    res.status(200).end();
  }

  public static async getAllUserFavoriteAddresses(req: Request, res: Response): Promise<void> {
    const { userInfo } = <IUserInfoInBody>req.body;
    const paginationRequest = <IPaginationRequest>req.query;

    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    const allFavorites = await FavoritesService.getAllUserFavoriteAddresses({
      userInfo,
      pagination,
    });

    res.status(200).json(allFavorites);
  }
}
