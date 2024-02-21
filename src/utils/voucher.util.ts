import { Request } from 'express';
import {
  IVouchersCodeArray,
  IVouchersCreateInfo,
  IVouchersNew,
  IVouchersNewArraySchema,
} from '../interfaces/IVouchers';
import ExcelUtil from './excel.util';
import CustomError, { vouchersObjectNotFound } from './customError.util';

export default class VoucherUtil {
  public static getVoucherCodesFromReq(req: Request): IVouchersNew[] {
    if (req.file?.buffer) {
      const { buffer } = req.file;

      const vouchers = ExcelUtil.read<IVouchersNew>(buffer);
      IVouchersNewArraySchema.parse(vouchers);

      return vouchers;
    }

    if (req.body?.vouchers) {
      const { vouchers } = req.body;

      const voucherCodesArray = VoucherUtil.formatVoucherCodesArray(vouchers);
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
}
