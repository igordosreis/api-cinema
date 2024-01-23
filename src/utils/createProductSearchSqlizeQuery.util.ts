/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IProductQuery } from '../interfaces/IProducts';

class CreateProductSearchSqlizeQuery {
  private addParams = ({ term, establishmentId, type, available }: IProductQuery) => {
    const searchQuery = [];
    searchQuery.push({ purchasable: true });
    searchQuery.push({ active: true });
    if (term) {
      searchQuery.push({
        [Op.or]: {
          name: { [Op.substring]: term },
          description: { [Op.substring]: term },
          '$brand.name$': { [Op.substring]: term },
        },
      });
    }
    if (type) searchQuery.push({ '$typeInfo.id$': { [Op.eq]: type } });
    if (establishmentId) searchQuery.push({ establishmentId });
    // if (tags) searchQuery.push({ '$productTags.tag_id$': { [Op.and]: tags } });
    // if (active) searchQuery.push({ active });

    return {
      where: {
        [Op.and]: searchQuery,
      },
      having: available ? { available } : {},
      // having: available ? { available } : { '$productTags.tag_id$': { [Op.overlap]: tags } },
    };
  };

  create = (formattedQuery: IProductQuery) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { having: {}, where: {} };
  };
}

export default new CreateProductSearchSqlizeQuery();
