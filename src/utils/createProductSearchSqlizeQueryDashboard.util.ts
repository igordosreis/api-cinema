/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IProductQueryDashboard } from '../interfaces/IProducts';

class CreateProductSearchSqlizeQueryDashboard {
  private addParams = ({
    purchasable,
    active,
    search,
    establishmentId,
    type,
    available,
  }: IProductQueryDashboard) => {
    const searchQuery = [];
    if (purchasable) searchQuery.push({ purchasable });
    if (active) searchQuery.push({ active });
    if (search) {
      const isSearchNumber = Number(search);
      if (isSearchNumber) {
        searchQuery.push({ productId: search });
      } else {
        searchQuery.push({
          [Op.or]: {
            name: { [Op.substring]: search },
            description: { [Op.substring]: search },
            '$brand.name$': { [Op.substring]: search },
          },
        });
      }
    }
    if (type) searchQuery.push({ '$typeInfo.id$': { [Op.eq]: type } });
    if (establishmentId) searchQuery.push({ establishmentId });

    return {
      where: {
        [Op.and]: searchQuery,
      },
      having: available ? { available } : {},
    };
  };

  create = (formattedQuery: IProductQueryDashboard) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { having: {}, where: {} };
  };
}

export default new CreateProductSearchSqlizeQueryDashboard();
