import { Request } from 'express';
import {
  IVouchersCodeArray,
  IVouchersCreateInfo,
  IVouchersNew,
  IVouchersNewSchema,
} from '../interfaces/IVouchers';
import Excel from './excel.util';
import CustomError, { vouchersObjectNotFound } from './customError.util';

export default class Voucher {
  public static getVouchersArray(req: Request): IVouchersNew {
    if (req.file?.buffer) {
      const { buffer } = req.file;

      const vouchers = Excel.read<string>(buffer);
      IVouchersNewSchema.parse(vouchers);

      return vouchers;
    }

    if (req.body?.vouchers) {
      const { vouchers } = req.body;

      IVouchersNewSchema.parse(vouchers);

      return vouchers as IVouchersNew;
    }

    throw new CustomError(vouchersObjectNotFound);
  }

  public static createArray({
    vouchers,
    date,
    productId,
  }: IVouchersCreateInfo): IVouchersCodeArray {
    const formattedArray = vouchers.map((voucherCode) => ({
      voucherCode,
      expireAt: date,
      productId,
    }));

    return formattedArray;
  }
}
