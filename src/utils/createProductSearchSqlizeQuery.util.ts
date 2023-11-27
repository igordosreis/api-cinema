import { Op } from 'sequelize';
import { IProductFormattedQuery } from '../interfaces/IProducts';

class CreateProductSearchSqlizeQuery {
  addParams = ({ term, establishmentId, type, available }: IProductFormattedQuery) => {
    const searchQuery = [];
    if (term) searchQuery.push({ name: { [Op.like]: term } }, { description: { [Op.like]: term } });
    if (type) searchQuery.push({ type: { [Op.like]: type } });
    if (establishmentId) searchQuery.push({ establishmentId });
    if (available) searchQuery.push({ active: available });

    return {
      [Op.or]: searchQuery,
    };
  };

  create = (formattedQuery: IProductFormattedQuery) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);
    return areThereAnyParams ? this.addParams(formattedQuery) : {};
  };
}

export default new CreateProductSearchSqlizeQuery();
