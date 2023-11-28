import VouchersUsedModel from '../database/models/VouchersUsed.model';

export default class UsersService {
  public static async getUserVoucherHistory(userId: number) {
    const userVoucherHistory = await VouchersUsedModel.findAll({
      where: { userId },
    });

    return userVoucherHistory;
  }
}
