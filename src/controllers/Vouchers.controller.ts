import { Request, Response } from 'express';
import { VouchersService } from '../services';
import { IUserInfoInBody } from '../interfaces/IUser';
import { IPaginationRequest } from '../interfaces/IPagination';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import Voucher from '../utils/voucher.util';
import { IVoucherNewParamsRaw } from '../interfaces/IVouchers';

export default class VouchersController {
  public static async getAllVouchersUserByDate(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id: userId },
      },
    } = <IUserInfoInBody>req.body;
    const paginationRequest = <IPaginationRequest>req.query;

    const pagination = formatRequestQueryUtil.formatPagination(paginationRequest);
    const allUserVouchers = await VouchersService.getAllVouchersUserByDate({ userId, pagination });

    res.status(200).json(allUserVouchers);
  }

  public static async createVouchers(req: Request, res: Response): Promise<void> {
    const vouchers = Voucher.getVouchersArray(req);
    const vouchersParams = <IVoucherNewParamsRaw>req.query;

    const vouchersParamsFormatted = formatRequestQueryUtil.formartNewVouchersParams(vouchersParams);
    const voucherCodeArray = Voucher.createArray({ ...vouchersParamsFormatted, vouchers });

    await VouchersService.createVouchers(voucherCodeArray);

    res.status(200).end();
  }
}
