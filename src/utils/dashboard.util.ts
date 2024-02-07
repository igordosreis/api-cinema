import { Request } from 'express';
import {
  IVouchersCodeArray,
  IVouchersCreateInfo,
  IVouchersNew,
  IVouchersNewArraySchema,
} from '../interfaces/IVouchers';
import ExcelUtil from './excel.util';
import CustomError, { vouchersObjectNotFound } from './customError.util';

export default class Dashboard {
  public static getVoucherCodesFromReq(req: Request): IVouchersNew[] {
    if (req.file?.buffer) {
      const { buffer } = req.file;

      const vouchers = ExcelUtil.read<IVouchersNew>(buffer);
      IVouchersNewArraySchema.parse(vouchers);

      return vouchers;
    }

    if (req.body?.vouchers) {
      const { vouchers } = req.body;

      const voucherCodesArray = Dashboard.formatVoucherCodesArray(vouchers);
      IVouchersNewArraySchema.parse(voucherCodesArray);

      return voucherCodesArray;
    }

    throw new CustomError(vouchersObjectNotFound);
  }

  public static addInfoToVoucherCodesArray({
    vouchers,
    date,
    productId,
  }: IVouchersCreateInfo): IVouchersCodeArray {
    const formattedArray = vouchers.map((voucherCode) => ({
      ...voucherCode,
      expireAt: date,
      productId,
    }));

    return formattedArray;
  }

  public static formatVoucherCodesArray(vouchers: string[]) {
    const voucherCodesArray = vouchers.map((voucher) => ({ voucherCode: voucher }));

    return voucherCodesArray;
  }

  public static formatTagsArrayWithIds(
    itemInfo: { tags: number[]; productId: number } | { tags: number[]; packId: number },
  ): Array<{ tagId: number; productId: number }> | Array<{ tagId: number; packId: number }> {
    const formattedArray = itemInfo.tags.map((tag) => {
      if ('productId' in itemInfo) {
        return {
          tagId: tag,
          productId: itemInfo.productId,
        };
      }
      if ('packId' in itemInfo) {
        return {
          tagId: tag,
          packId: itemInfo.packId,
        };
      }
      throw new Error('Array inválido');
    }) as Array<{ tagId: number; productId: number }> | Array<{ tagId: number; packId: number }>;

    return formattedArray;
  }

  public static formatTagsArrayWithName(tags: string[]) {
    const formattedArray = tags.map((tag) => ({
      name: tag,
    }));

    return formattedArray;
  }
}
