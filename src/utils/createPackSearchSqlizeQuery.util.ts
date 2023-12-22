/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IPackSearchQuery } from '../interfaces/IPacks';

class CreatePackSearchSqlizeQuery {
  private addParams = ({ term, establishmentId, type, active }: IPackSearchQuery) => {
    const searchQuery = [];
    if (term) {
      searchQuery.push({
        [Op.or]: {
          name: { [Op.substring]: term },
          description: { [Op.substring]: term },
          '$packInfo.productDetails.name$': { [Op.substring]: term },
          '$packInfo.productDetails.description$': { [Op.substring]: term },
        },
      });
    }
    if (type) searchQuery.push({ '$packInfo.productDetails.type': { [Op.eq]: type } });
    if (establishmentId) {
      searchQuery.push({
        '$packInfo.productDetails.establishmentId': { [Op.eq]: establishmentId },
      });
    }
    if (active) searchQuery.push({ active });

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

export default new CreatePackSearchSqlizeQuery();
