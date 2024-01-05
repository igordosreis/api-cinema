/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import { Op } from 'sequelize';
import FavoriteEstablishmentAddresses from '../database/models/FavoriteEstablishmentAddresses.model';
import { IFavoriteToggleRequest } from '../interfaces/IFavorites';
import CustomError, { favoriteError } from '../utils/customError.util';
import EstablishmentsAddressesModel from '../database/models/EstablishmentsAddresses.model';

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
        defaults: {
          establishmentAddressId,
          userId,
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
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - -- - - - -error: ', error);

      throw new CustomError(favoriteError);
    }
  }

  public static async getAllUserFavoriteAddresses(userId: number) {
    try {
      const allFavorites = await FavoriteEstablishmentAddresses.findAll({
        where: { userId },
        include: [{ model: EstablishmentsAddressesModel, as: 'favoriteEstablishmentAddress' }],
      });

      return allFavorites;
    } catch (error) {
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - -- - - - -error: ', error);

      throw new CustomError(favoriteError);
    }
  }
}
