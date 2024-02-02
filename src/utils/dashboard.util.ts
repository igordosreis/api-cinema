import { Request } from 'express';
import {
  IVouchersCodeArray,
  IVouchersCreateInfo,
  IVouchersNew,
  IVouchersNewArraySchema,
} from '../interfaces/IVouchers';
import Excel from './excel.util';
import CustomError, { vouchersObjectNotFound } from './customError.util';

export default class Dashboard {
  public static getVoucherCodesFromReq(req: Request): IVouchersNew[] {
    if (req.file?.buffer) {
      const { buffer } = req.file;

      const vouchers = Excel.read<IVouchersNew>(buffer);
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

  public static formatTagsArrayWithIds({ tags, productId }: { tags: number[]; productId: number }) {
    const formattedArray = tags.map((tag) => ({
      tagId: tag,
      productId,
    }));

    return formattedArray;
  }

  public static formatTagsArrayWithName(tags: string[]) {
    const formattedArray = tags.map((tag) => ({
      name: tag,
    }));

    return formattedArray;
  }
}
