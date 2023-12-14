/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IProductFormattedQuery } from '../interfaces/IProducts';

class CreateProductSearchSqlizeQuery {
  private addParams = ({
    term,
    establishmentId,
    type,
    available,
    active,
  }: IProductFormattedQuery) => {
    const searchQuery = [];
    if (term) {
      searchQuery.push({
        [Op.or]: { name: { [Op.substring]: term }, description: { [Op.substring]: term } },
      });
    }
    if (type) searchQuery.push({ '$typeInfo.name$': { [Op.like]: type } });
    if (establishmentId) searchQuery.push({ establishmentId });
    if (active) searchQuery.push({ active });

    return {
      where: {
        [Op.and]: searchQuery,
      },
      having: available ? { available } : {},
    };
  };

  create = (formattedQuery: IProductFormattedQuery) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { having: {}, where: {} };
  };
}

export default new CreateProductSearchSqlizeQuery();
