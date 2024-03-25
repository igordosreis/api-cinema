/* eslint-disable max-lines-per-function */
import { Request } from 'express';
import { Transaction } from 'sequelize';
import {
  IVouchersInfoArray,
  IVouchersCreateInfo,
  IVouchersNew,
  IVouchersNewArraySchema,
} from '../interfaces/IVouchers';
import ExcelUtil from './excel.util';
import CustomError, {
  batchAlreadyInUse,
  cannotValidateVouchers,
  productNotFound,
  voucherDuplicateFound,
  vouchersObjectNotFound,
  wrongEstablishmentId,
} from './customError.util';
import { CONSOLE_LOG_ERROR_TITLE } from '../constants';
import VouchersAvailableModel from '../database/models/VouchersAvailable.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import VouchersWithdrawModel from '../database/models/VouchersWithdraw.model';
import VouchersUserModel from '../database/models/VouchersUser.model';

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
    establishmentId,
    batchId,
  }: IVouchersCreateInfo): IVouchersInfoArray {
    const formattedArray = voucherCodes.map((voucherCode) => ({
      ...voucherCode,
      expireAt: date,
      establishmentId,
      productId,
      batchId,
    }));

    return formattedArray;
  }

  public static formatVoucherCodesArray(vouchers: string[]) {
    const voucherCodesArray = vouchers.map((voucher) => ({ voucherCode: voucher }));

    return voucherCodesArray;
  }

  private static findDuplicateCodesInFile(voucherCodesStringArray: string[]) {
    const duplicatesIndexes: IVoucherDuplicateIndexes = {};
    voucherCodesStringArray.filter((item, index) => {
      if (voucherCodesStringArray.indexOf(item) !== index) {
        duplicatesIndexes[index] = index;

        return item;
      }

      return false;
    });
    
    return duplicatesIndexes;
  }

  private static async findDuplicateCodesInDatabase(
    vouchers: IVouchersInfoArray,
    transaction: Transaction,
  ) {
    const duplicatesIndexes: IVoucherDuplicateIndexes = {};

    await Promise.all(vouchers.map(async ({ voucherCode, productId }, index) => {
      const voucher = await VouchersAvailableModel.findOne({ 
        where: { voucherCode, productId },
        transaction, 
      });

      const isVoucherCodeFoundInDB = voucher;
      if (isVoucherCodeFoundInDB) {
        duplicatesIndexes[index] = index;
      }

      return voucher;
    }));

    return duplicatesIndexes;
  }

  public static formatVouchersDuplicateErrors(
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

      return voucherCodeArray;
    });

    const errorsArray = [
      headers,
      ...vouchersErrorsAoA,
    ];

    return errorsArray;
  }

  public static async validateVoucherCodes(vouchers: IVouchersInfoArray, transaction: Transaction) {
    try {
      const voucherCodesStringArray = vouchers.map(({ voucherCode }) => voucherCode);

      const fileDuplicates = this.findDuplicateCodesInFile(voucherCodesStringArray);
      const databaseDuplicates = await this.findDuplicateCodesInDatabase(vouchers, transaction);

      const isError = Object.keys(fileDuplicates).length > 0 
        || Object.keys(databaseDuplicates).length > 0;
      if (isError) {
        const errorsArray = this.formatVouchersDuplicateErrors(
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

  public static async validateProductAndEstablishmentIds(
    productId: number, 
    establishmentId: number,
    transaction: Transaction,
  ) {
    try {
      const product = await EstablishmentsProductsModel.findByPk(productId, { transaction });

      const isProductNotFound = !product;
      if (isProductNotFound) throw new CustomError(productNotFound);

      const { establishmentId: establishmentIdFromDb } = product;
      
      const isEstablishmentIdDifferent = establishmentId !== establishmentIdFromDb;
      if (isEstablishmentIdDifferent) throw new CustomError(wrongEstablishmentId);
    } catch (error) {
      console.log(CONSOLE_LOG_ERROR_TITLE, error);

      if (error instanceof CustomError) throw error;

      throw new CustomError(cannotValidateVouchers);
    }
  }

  public static async validateBatchCode(batchId: string, transaction: Transaction) {
    const verifyBatchInVouchersAvailable = await VouchersAvailableModel.findOne({ 
      where: { batchId },
      transaction,
    });
    const verifyBatchInVouchersUser = await VouchersUserModel.findOne({ 
      where: { batchId },
      transaction,
    });
    const verifyBatchInVouchersWithdraw = await VouchersWithdrawModel.findOne({ 
      where: { batchId },
      transaction,
    });
    const isBatchIdAlreadyInUse = verifyBatchInVouchersAvailable 
      || verifyBatchInVouchersUser
      || verifyBatchInVouchersWithdraw;

    if (isBatchIdAlreadyInUse) throw new CustomError(batchAlreadyInUse);
  }

  private static parseStatus(status: undefined | 'available' | 'user' | 'withdraw') {
    if (status === 'available' || status === undefined) return 'disponível';
    if (status === 'user') return 'usado';
    if (status === 'withdraw') return 'usado';
  }

  public static addStatusToVoucher(
    vouchers: VouchersAvailableModel[] | VouchersUserModel[] | VouchersWithdrawModel[],
    status: undefined | 'available' | 'user' | 'withdraw',
  ) {
    const parsedVouchers = vouchers.map((voucher) => {
      // const parsedVoucher = voucher.toJSON();

      const newVoucher = {
        ...voucher,
        status: VoucherUtil.parseStatus(status),
      };

      return newVoucher;
    });

    return parsedVouchers;
  }
}
