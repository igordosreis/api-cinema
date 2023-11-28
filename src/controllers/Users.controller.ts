import { Request, Response } from 'express';
import UsersService from '../services/Users.service';
import { IUserInfo } from '../interfaces/IUser';

export default class UsersController {
  public static async getUserVoucherHistory(req: Request, res: Response): Promise<void> {
    const {
      user: { id: userId },
    }: IUserInfo = req.body.userInfo;

    const userVoucherHistory = await UsersService.getUserVoucherHistory(userId);

    res.status(200).json(userVoucherHistory);
  }
}
