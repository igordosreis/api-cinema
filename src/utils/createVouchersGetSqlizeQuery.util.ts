/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IVouchersGetDashboard } from '../interfaces/IVouchers';

class CreateVouchersGetSqlizeQuery {
  private addParams = ({ productId, establishmentId, search }: IVouchersGetDashboard) => {
    const searchQuery = [];
    if (productId) searchQuery.push({ productId });
    if (establishmentId) searchQuery.push({ establishmentId });
    if (search) searchQuery.push({ voucherCode: search });

    return {
      where: {
        [Op.and]: searchQuery,
      },
    };
  };

  create = (formattedQuery: IVouchersGetDashboard) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { where: {} };
  };
}

export default new CreateVouchersGetSqlizeQuery();
