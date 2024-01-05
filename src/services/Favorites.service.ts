/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Op } from 'sequelize';
import FavoriteEstablishmentAddresses from '../database/models/FavoriteEstablishmentAddresses.model';
import { IFavoriteToggleRequest } from '../interfaces/IFavorites';
import CustomError, { favoriteError } from '../utils/customError.util';

export default class FavoritesService {
  public static async toggleFavoriteEstablishment({
    establishmentAddressId,
    userId,
  }: IFavoriteToggleRequest) {
    try {
      const [, created] = await FavoriteEstablishmentAddresses.findOrCreate({
        where: {
          [Op.and]: [{ establishmentAddressId }, { userId }],
        },
      });

      const isEstablishmentAlreadyFavorite = !created;
      if (isEstablishmentAlreadyFavorite) {
        FavoriteEstablishmentAddresses.destroy({
          where: {
            [Op.and]: [{ establishmentAddressId }, { userId }],
          },
        });
      }
    } catch (error) {
      throw new CustomError(favoriteError);
    }
  }
}
