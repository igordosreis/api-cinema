import { Request, Response } from 'express';
import { IUserInfoInBody } from '../interfaces/IUser';
import { FavoritesService } from '../services';

export default class FavoritesController {
  public static async toggleFavoriteEstablishment(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id: userId },
      },
    } = <IUserInfoInBody>req.body;
    const { id: establishmentAddressId } = req.params;

    await FavoritesService.toggleFavoriteEstablishment({
      userId,
      establishmentAddressId: Number(establishmentAddressId),
    });

    res.status(200).end();
  }

  public static async getAllUserFavoriteAddresses(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id: userId },
      },
    } = <IUserInfoInBody>req.body;

    const allFavorites = await FavoritesService.getAllUserFavoriteAddresses(userId);

    res.status(200).json(allFavorites);
  }
}
