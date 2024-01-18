/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { Op } from 'sequelize';
import CartModel from '../database/models/Cart.model';
import { ICartOperation } from '../interfaces/ICart';
import CustomError, {
  cartAccessError,
  cartAddError,
  cartRemoveAllError,
  cartRemoveError,
} from '../utils/customError.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';

export default class CartService {
  public static async getCart({ userId, isCount }: { userId: number, isCount?: boolean }) {
    try {
      const searchParams = isCount
        ? { where: { userId } }
        : {
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
          where: { userId, waiting: false },
        };

      const currentCart = await CartModel.findAll(searchParams);

      return currentCart;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAccessError);
    }
  }

  public static async getCartCount(userId: number) {
    try {
      const isCount = true;
      const currentCart = await this.getCart({ userId, isCount });

      const allCartUnits = currentCart.reduce((accCount, currItem) => {
        const newAccCount = accCount + currItem.quantity;

        return newAccCount;
      }, 0);

      return allCartUnits;
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAccessError);
    }
  }

  public static async addToCart(cartOperationInfo: ICartOperation) {
    try {
      const isProduct = 'productId' in cartOperationInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartOperationInfo;
        const [product, created] = await CartModel.findOrCreate({
          where: {
            [Op.and]: [{ userId }, { productId }, { establishmentId }, { waiting: false }],
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
        const currentCart = await this.getCart({ userId });

        return currentCart;
      }

      const isPack = 'packId' in cartOperationInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartOperationInfo;
        const [pack, created] = await CartModel.findOrCreate({
          where: {
            [Op.and]: [{ userId }, { packId }, { establishmentId }, { waiting: false }],
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
        const currentCart = await this.getCart({ userId });

        return currentCart;
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartAddError);
    }
  }

  public static async removeFromCart(cartOperationInfo: ICartOperation) {
    try {
      const isProduct = 'productId' in cartOperationInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartOperationInfo;
        const product = await CartModel.findOne({
          where: {
            [Op.and]: [{ userId }, { productId }, { establishmentId }, { waiting: false }],
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
        const currentCart = await this.getCart({ userId });

        return currentCart;
      }

      const isPack = 'packId' in cartOperationInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartOperationInfo;
        const pack = await CartModel.findOne({
          where: {
            [Op.and]: [{ userId }, { packId }, { establishmentId }, { waiting: false }],
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
        const currentCart = await this.getCart({ userId });

        return currentCart;
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartRemoveError);
    }
  }

  public static async deleteFromCart(cartOperationInfo: ICartOperation) {
    try {
      const isProduct = 'productId' in cartOperationInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartOperationInfo;
        await CartModel.destroy({
          where: {
            [Op.and]: [{ userId }, { productId }, { establishmentId }, { waiting: false }],
          },
        });
        const currentCart = await this.getCart({ userId });

        return currentCart;
      }

      const isPack = 'packId' in cartOperationInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartOperationInfo;
        await CartModel.destroy({
          where: {
            [Op.and]: [{ userId }, { packId }, { establishmentId }, { waiting: false }],
          },
        });
        const currentCart = await this.getCart({ userId });

        return currentCart;
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartRemoveError);
    }
  }

  public static async deleteAllCart(userId: number) {
    try {
      await CartModel.destroy({
        where: { userId },
      });
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      throw new CustomError(cartRemoveAllError);
    }
  }
}
