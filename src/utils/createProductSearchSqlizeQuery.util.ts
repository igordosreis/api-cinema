import { Op } from 'sequelize';
import { IProductFormattedQuery } from '../interfaces/IProducts';

class CreateProductSearchSqlizeQuery {
  private addParams = ({ term, establishmentId, type, available }: IProductFormattedQuery) => {
    const searchQuery = [];
    if (term) {
      searchQuery.push({
        [Op.or]: { name: { [Op.substring]: term }, description: { [Op.substring]: term } },
      });
    }
    if (type) searchQuery.push({ type: { [Op.like]: type } });
    if (establishmentId) searchQuery.push({ establishmentId });
    if (available) searchQuery.push({ active: available });

    return {
      [Op.and]: searchQuery,
    };
  };

  create = (formattedQuery: IProductFormattedQuery) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : {};
  };
}

export default new CreateProductSearchSqlizeQuery();
