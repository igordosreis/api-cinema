import { Request, Response } from 'express';
import { VouchersService } from '../services';
import { IUserInfoInBody } from '../interfaces/IUser';
import { IPaginationRequest } from '../interfaces/IPagination';
import formatRequestQueryUtil from '../utils/formatRequestQuery.util';

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
}
