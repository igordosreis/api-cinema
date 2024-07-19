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
    productId,
    establishmentId,
    type,
    available,
    // expireAt,
  }: IProductQueryDashboard) => {
    const searchQuery = [];
    if (purchasable) searchQuery.push({ purchasable });
    if (purchasable === false) searchQuery.push({ purchasable });
    if (active) searchQuery.push({ active });
    if (active === false) searchQuery.push({ active });
    if (search) {
      const isSearchNumber = !!Number(search);
      if (isSearchNumber) {
        const parsedSearch = Number(search);
        const parsedProductId = productId || parsedSearch;
        const parsedEstablishmentId = establishmentId || parsedSearch;
        searchQuery.push({ 
          [Op.or]: {
            productId: parsedProductId,
            establishmentId: parsedEstablishmentId,
          },
        });
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
    if (productId) searchQuery.push({ productId });
    if (establishmentId) searchQuery.push({ establishmentId });
    // if (expireAt) searchQuery.push({ '$batchProduct.expireAt$': { [Op.like]: expireAt } });

    return {
      where: {
        [Op.and]: searchQuery,
      },
      having: available || available === false ? { available } : {},
    };
  };

  create = (formattedQuery: IProductQueryDashboard) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { having: {}, where: {} };
  };
}

export default new CreateProductSearchSqlizeQueryDashboard();
