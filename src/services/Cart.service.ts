/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
import { Op } from 'sequelize';
import CartModel from '../database/models/Cart.model';
import { ICartAdd } from '../interfaces/ICart';
import CustomError, { cartAccessError, cartAddError } from '../utils/customError.util';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PacksModel from '../database/models/Packs.model';

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
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);

      throw new CustomError(cartAccessError);
    }
  }

  // public static async addToCart({ userId, cartInfo }: ICartAdd) {
  //   try {
  //     const parsedCartInfo = cartInfo.map((info) => ({ ...info, userId }));

  //     await CartModel.bulkCreate(parsedCartInfo);
  //   } catch (error) {
  //     console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);

  //     throw new CustomError(cartAddError);
  //   }
  // }

  public static async addToCart(cartAddInfo: ICartAdd | undefined) {
    try {
      const isProduct = cartAddInfo && 'productId' in cartAddInfo;
      if (isProduct) {
        const { productId, establishmentId, userId } = cartAddInfo;
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
          const newQuantity = product.quantity + 1;

          await product.update({ quantity: newQuantity });
        }

        const currentCart = await this.getCart(userId);

        return currentCart;
      }

      const isPack = cartAddInfo && 'isPack' in cartAddInfo;
      if (isPack) {
        const { packId, establishmentId, userId } = cartAddInfo;
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
          const newQuantity = pack.quantity + 1;

          await pack.update({ quantity: newQuantity });
        }

        const currentCart = await this.getCart(userId);

        return currentCart;
      }
    } catch (error) {
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);

      throw new CustomError(cartAddError);
    }
  }
}
