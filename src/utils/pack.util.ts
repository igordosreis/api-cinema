/* eslint-disable max-lines-per-function */
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import { IProductInPack } from '../interfaces/IPacks';
import CustomError, {
  packEstablishmentIdError,
  packPriceValidationError,
  productNotFound,
} from './customError.util';

export default class PackUtil {
  public static setupLimit(counterLimit: number | undefined) {
    const isLimited = counterLimit;
    if (isLimited) {
      return {
        limited: true,
        counterLimit,
        counter: 0,
      };
    }
    return {};
  }

  public static formatProductArrayWithPackId(products: IProductInPack[], packId: number) {
    const formattedArray = products.map((productInfo) => ({
      ...productInfo,
      packId,
    }));

    return formattedArray;
  }

  public static async validateProducts({
    products,
    packPrice,
    establishmentId,
  }: {
    products: IProductInPack[];
    packPrice: number;
    establishmentId: number;
  }) {
    const totalPrice = await products.reduce(async (accPrice: Promise<number>, currProduct) => {
      const newAccPrice = await accPrice;
      const { productId, price, quantity } = currProduct;
      const product = await EstablishmentsProductsModel.findByPk(productId);

      const isProductNotFound = !product;
      if (isProductNotFound) throw new CustomError(productNotFound);

      const isEstablishmentNotTheSame = product.establishmentId !== establishmentId;
      if (isEstablishmentNotTheSame) throw new CustomError(packEstablishmentIdError);

      return newAccPrice + price * quantity;
    }, Promise.resolve(0));

    const isPriceNotEqual = Math.abs(packPrice - totalPrice) >= 0.01;
    if (isPriceNotEqual) throw new CustomError(packPriceValidationError);
  }
}
