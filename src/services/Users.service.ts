import VouchersUserModel from '../database/models/VouchersUser.model';

export default class UsersService {
  public static async getUserVoucherHistory(userId: number) {
    const userVoucherHistory = await VouchersUserModel.findAll({
      where: { userId },
    });

    return userVoucherHistory;
  }
}
