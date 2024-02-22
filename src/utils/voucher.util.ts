/* eslint-disable max-lines-per-function */
import { Request } from 'express';
import {
  IVouchersInfoArray,
  IVouchersCreateInfo,
  IVouchersNew,
  IVouchersNewArraySchema,
} from '../interfaces/IVouchers';
import ExcelUtil from './excel.util';
import CustomError, {
  cannotValidateVouchers,
  voucherDuplicateFound,
  vouchersObjectNotFound,
} from './customError.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';

type IVoucherDuplicateIndexes = {
  [key: number]: number;
};

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
    voucherCodes,
    date,
    productId,
  }: IVouchersCreateInfo): IVouchersInfoArray {
    const formattedArray = voucherCodes.map((voucherCode) => ({
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

  private static findDuplicateCodesInFile(voucherCodesStringArray: string[]) {
    const duplicatesIndexes: IVoucherDuplicateIndexes = {};
    // const duplicatesIndexes: number[] = [];
    voucherCodesStringArray.filter((item, index) => {
      if (voucherCodesStringArray.indexOf(item) !== index) {
        duplicatesIndexes[index] = index;
        // duplicatesIndexes.push(index);
        return item;
      }
      return false;
    });
    
    return duplicatesIndexes;
  }

  private static async findDuplicateCodesInDatabase(vouchers: IVouchersInfoArray) {
    const duplicatesIndexes: IVoucherDuplicateIndexes = {};
    // const duplicatesIndexes: number[] = [];

    await Promise.all(vouchers.map(async ({ voucherCode, productId }, index) => {
      const voucher = await VouchersAvailableModel.findOne({ where: { voucherCode, productId } });

      const isVoucherCodeFoundInDB = voucher;
      if (isVoucherCodeFoundInDB) {
        duplicatesIndexes[index] = index;
        // duplicatesIndexes.push(index);
      }

      return voucher;
    }));

    return duplicatesIndexes;
  }

  public static async formatVouchersDuplicateErrors(
    voucherCodesStringArray: string[],
    fileDuplicates: IVoucherDuplicateIndexes,
    databaseDuplicates: IVoucherDuplicateIndexes,
  ) {
    const headers = ['voucherCodes', 'errors'];

    const vouchersErrorsAoA = voucherCodesStringArray.map((voucherCode, index) => {
      const voucherCodeArray = [voucherCode];

      const isFileDuplicate = Number.isInteger(fileDuplicates[index]);
      if (isFileDuplicate) {
        voucherCodeArray.push('duplicado no arquivo');
      }

      const isDatabaseDuplicate = Number.isInteger(databaseDuplicates[index]);
      if (isDatabaseDuplicate) {
        const isSecondError = voucherCodeArray[1];
        if (isSecondError) {
          voucherCodeArray[1] = `${voucherCodeArray[1]}, duplicado no banco de dados`;
        } else {
          voucherCodeArray.push('duplicado no banco de dados');
        }
      }
      console.log(`-------            ---------               --------------       
      -                          voucherCodeArray
  `, voucherCodeArray);
      return voucherCodeArray;
    });

    const errorsArray = [
      headers,
      ...vouchersErrorsAoA,
    ];
    console.log(`-------            ---------               --------------       
    -                          errorsArray
`, errorsArray);
    return errorsArray;
  }

  public static async validateVoucherCodes(vouchers: IVouchersInfoArray) {
    try {
      const voucherCodesStringArray = vouchers.map(({ voucherCode }) => voucherCode);

      const fileDuplicates = this.findDuplicateCodesInFile(voucherCodesStringArray);
      const databaseDuplicates = await this.findDuplicateCodesInDatabase(vouchers);

      const isError = Object.keys(fileDuplicates).length > 0 
        || Object.keys(databaseDuplicates).length > 0;
      if (isError) {
        const errorsArray = await this.formatVouchersDuplicateErrors(
          voucherCodesStringArray,
          fileDuplicates,
          databaseDuplicates,
        );

        const errorFileUrl = ExcelUtil.writeErrorFileWIthUrl(errorsArray);
        throw new CustomError(voucherDuplicateFound(errorFileUrl));
      }
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotValidateVouchers);
    }
  }
}
