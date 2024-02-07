import { IProductInPack } from '../interfaces/IPacks';

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
}
