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

  public static async addProduct({ id, category, userId }: ICartAdd) {
    try {
      const isProduct = category === 'product';
      if (isProduct) {
        const [product, created] = await CartModel.findOrCreate({
          where: {
            [Op.and]: [{ userId }, { productId: id }],
          },
          defaults: {
            userId,
            productId: id,
            quantity: 1,
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
    } catch (error) {
      console.log('--- - -- -- -- - - --  - - -- - -- - ---- -- -- - --- - - - -error: ', error);

      throw new CustomError(cartAddError);
    }
  }
}
