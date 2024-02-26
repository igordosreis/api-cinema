/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IEstablishmentAddressGet } from '../interfaces/IEstablishments';

class CreateAddressGetSqlizeQuery {
  private addParams = ({ search }: IEstablishmentAddressGet) => {
    const searchQuery = [];
    if (search) {
      searchQuery.push({
        [Op.or]: {
          name: { [Op.substring]: search },
          address: { [Op.substring]: search },
        },
      });
    }

    return {
      where: {
        [Op.and]: searchQuery,
      },
    };
  };

  create = (formattedQuery: IEstablishmentAddressGet) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { where: {} };
  };
}

export default new CreateAddressGetSqlizeQuery();
