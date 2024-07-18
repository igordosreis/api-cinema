/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IProductQueryDashboard } from '../interfaces/IProducts';

class CreatePackSearchSqlizeQueryDashboard {
  private addParams = ({ establishmentId, active }: IProductQueryDashboard) => {
    const searchQuery = [];
    if (active) searchQuery.push({ active });
    if (active === false) searchQuery.push({ active });
    if (establishmentId) {
      searchQuery.push({
        '$packInfo.productDetails.establishment_id$': { [Op.eq]: establishmentId },
      });
    }

    return {
      where: {
        [Op.and]: searchQuery,
      },
    };
  };

  create = (packSearchQuery: IProductQueryDashboard) => {
    const areThereAnyParams = Object.values(packSearchQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(packSearchQuery) : { where: {} };
  };
}

export default new CreatePackSearchSqlizeQueryDashboard();
