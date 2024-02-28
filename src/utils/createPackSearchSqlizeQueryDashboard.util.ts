/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IPackSearchQuery } from '../interfaces/IPacks';

class CreatePackSearchSqlizeQueryDashboard {
  private addParams = ({ establishmentId, active }: IPackSearchQuery) => {
    const searchQuery = [];
    if (active) searchQuery.push({ active });
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

  create = (packSearchQuery: IPackSearchQuery) => {
    const areThereAnyParams = Object.values(packSearchQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(packSearchQuery) : { where: {} };
  };
}

export default new CreatePackSearchSqlizeQueryDashboard();
