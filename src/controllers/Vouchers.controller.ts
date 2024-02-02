import { Request, Response } from 'express';
import { VouchersService } from '../services';
import { IUserInfoInBody } from '../interfaces/IUser';
import { IPaginationRequest } from '../interfaces/IPagination';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';
import Dashboard from '../utils/dashboard.util';
import { IVoucherNewParamsRaw, IVouchersCodeArraySchema } from '../interfaces/IVouchers';

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
    const vouchers = Dashboard.getVoucherCodesFromReq(req);
    const vouchersParams = <IVoucherNewParamsRaw>req.query;

    const vouchersParamsFormatted = formatRequestQueryUtil.formartNewVouchersParams(vouchersParams);
    const voucherCodeArray = Dashboard.addInfoToVoucherCodesArray({
      ...vouchersParamsFormatted,
      vouchers,
    });
    IVouchersCodeArraySchema.parse(voucherCodeArray);
    
    await VouchersService.createVouchers(voucherCodeArray);

    res.status(200).end();
  }
}
