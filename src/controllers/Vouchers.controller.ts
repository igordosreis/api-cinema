import { Request, Response } from 'express';
import { VouchersService } from '../services';
import { IUserInfoInBody } from '../interfaces/IUser';

export default class VouchersController {
  public static async getAllVouchersUserByDate(req: Request, res: Response): Promise<void> {
    const {
      userInfo: {
        user: { id: userId },
      },
    } = <IUserInfoInBody>req.body;

    const allUserVouchers = await VouchersService.getAllVouchersUserByDate(userId);

    res.status(200).json(allUserVouchers);
  }
}
