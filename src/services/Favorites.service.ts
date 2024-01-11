/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable max-len */
import sequelize, { Op } from 'sequelize';
import FavoriteEstablishmentAddresses from '../database/models/FavoriteEstablishmentAddresses.model';
import { IFavoriteToggleRequest } from '../interfaces/IFavorites';
import CustomError, { favoriteError } from '../utils/customError.util';
import EstablishmentsAddressesModel from '../database/models/EstablishmentsAddresses.model';
import { IUserInfo } from '../interfaces/IUser';
import { IPagination } from '../interfaces/IPagination';

export default class FavoritesService {
  public static async toggleFavoriteEstablishment({ addressId, userId }: IFavoriteToggleRequest) {
    try {
      const [, created] = await FavoriteEstablishmentAddresses.findOrCreate({
        where: {
          [Op.and]: [{ addressId }, { userId }],
        },
        defaults: {
          addressId,
          userId,
        },
      });

      const isEstablishmentAlreadyFavorite = !created;
      if (isEstablishmentAlreadyFavorite) {
        FavoriteEstablishmentAddresses.destroy({
          where: {
            [Op.and]: [{ addressId }, { userId }],
          },
        });
      }
    } catch (error) {
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - -- - - - -error: ', error);

      throw new CustomError(favoriteError);
    }
  }

  public static async getAllUserFavoriteAddresses({
    userInfo,
    pagination: { page, limit },
  }: {
    userInfo: IUserInfo;
    pagination: IPagination;
  }) {
    const {
      user: { id: userId },
      location: { latitude, longitude },
    } = userInfo;
    try {
      const distanceLiteral = sequelize.literal(
        `( 3959 * acos( cos( radians(${latitude}) ) * cos( radians( favoriteEstablishmentAddress.latitude ) ) * cos( radians( favoriteEstablishmentAddress.longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( favoriteEstablishmentAddress.latitude ) ) ) )`,
      );

      const allFavorites = await FavoriteEstablishmentAddresses.findAll({
        where: { userId },
        include: [
          {
            model: EstablishmentsAddressesModel,
            as: 'favoriteEstablishmentAddress',
            attributes:
              latitude && longitude ? { include: [[distanceLiteral, 'distance']] } : undefined,
          },
        ],
        order: latitude && longitude ? [[distanceLiteral, 'ASC']] : [],
        limit,
        offset: page * limit,
      });
      return allFavorites;
    } catch (error) {
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - -- - - - -error: ', error);

      throw new CustomError(favoriteError);
    }
  }
}
