/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { Op } from 'sequelize';
import CartModel from '../database/models/Cart.model';
import { ICartOperation } from '../interfaces/ICart';
import CustomError, { cartAccessError, cartAddError } from '../utils/customError.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';

export default class CartService {
  public static async getCart(userId: number) {
    try {
      const currentCart = await CartModel.findAll({
        include: [
          {
            model: EstablishmentsProductsModel,
            as: 'productCart',
            required: false,
          },
          {
            model: PacksModel,
            as: 'packCart',
            required: false,
          },
        ],
        where: { userId },
      });

      return currentCart;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAccessError);
    }
  }

  // public static async addToCart({ userId, cartInfo }: ICartAdd) {
  //   try {
  //     const parsedCartInfo = cartInfo.map((info) => ({ ...info, userId }));

  //     await CartModel.bulkCreate(parsedCartInfo);
  //   } catch (error) {
  //     console.log(CONSOLE_LOG_ERROR_TITLE, error);

  //     throw new CustomError(cartAddError);
  //   }
  // }

  public static async addToCart(cartOperationInfo: ICartOperation | undefined) {
    try {
      const isProduct = cartOperationInfo && 'productId' in cartOperationInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartOperationInfo;
        const [product, created] = await CartModel.findOrCreate({
          where: {
            [Op.and]: [{ userId }, { productId }, { establishmentId }],
          },
          defaults: {
            userId,
            productId,
            establishmentId,
            quantity: 1,
            packId: undefined,
          },
        });

        const isProductAlreadyInCart = !created;
        if (isProductAlreadyInCart) {
          await product.increment('quantity');
        }
        const currentCart = await this.getCart(userId);

        return currentCart;
      }

      const isPack = cartOperationInfo && 'packId' in cartOperationInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartOperationInfo;
        const [pack, created] = await CartModel.findOrCreate({
          where: {
            [Op.and]: [{ userId }, { packId }, { establishmentId }],
          },
          defaults: {
            userId,
            packId,
            establishmentId,
            quantity: 1,
            productId: undefined,
          },
        });

        const isPackAlreadyInCart = !created;
        if (isPackAlreadyInCart) {
          await pack.increment('quantity');
        }
        const currentCart = await this.getCart(userId);

        return currentCart;
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAddError);
    }
  }

  public static async removeFromCart(cartOperationInfo: ICartOperation | undefined) {
    try {
      const isProduct = cartOperationInfo && 'productId' in cartOperationInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartOperationInfo;
        const product = await CartModel.findOne({
          where: {
            [Op.and]: [{ userId }, { productId }, { establishmentId }],
          },
        });

        const isProductFound = product;
        if (isProductFound) {
          const isProductStillInCart = product.quantity - 1 > 0;
          if (isProductStillInCart) {
            await product.decrement('quantity');
          } else {
            await product.destroy();
          }
        }
        const currentCart = await this.getCart(userId);

        return currentCart;
      }

      const isPack = cartOperationInfo && 'packId' in cartOperationInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartOperationInfo;
        const pack = await CartModel.findOne({
          where: {
            [Op.and]: [{ userId }, { packId }, { establishmentId }],
          },
        });

        const isPackFound = pack;
        if (isPackFound) {
          const isPackStillInCart = pack.quantity - 1 > 0;
          if (isPackStillInCart) {
            await pack.decrement('quantity');
          } else {
            pack.destroy();
          }
        }
        const currentCart = await this.getCart(userId);

        return currentCart;
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAddError);
    }
  }

  public static async deleteFromCart(cartOperationInfo: ICartOperation | undefined) {
    try {
      const isProduct = cartOperationInfo && 'productId' in cartOperationInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartOperationInfo;
        await CartModel.destroy({
          where: {
            [Op.and]: [{ userId }, { productId }, { establishmentId }],
          },
        });
        const currentCart = await this.getCart(userId);

        return currentCart;
      }

      const isPack = cartOperationInfo && 'packId' in cartOperationInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartOperationInfo;
        await CartModel.destroy({
          where: {
            [Op.and]: [{ userId }, { packId }, { establishmentId }],
          },
        });
        const currentCart = await this.getCart(userId);

        return currentCart;
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAddError);
    }
  }

  public static async deleteAllCart(userId: number) {
    try {
      await CartModel.destroy({
        where: { userId },
      });
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAddError);
    }
  }
}
