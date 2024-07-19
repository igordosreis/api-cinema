/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IEstablishmentAddressGetParsed } from '../interfaces/IEstablishments';

class CreateAddressGetSqlizeQuery {
  private addParams = ({ 
    search, 
    establishmentId,
    addressId, 
    cityId, 
    active, 
  }: IEstablishmentAddressGetParsed) => {
    const searchQuery = [];

    const isSearchNumber = !!Number(search);
    const parsedSearch = Number(search);
    const parsedEstablishmentId = establishmentId || parsedSearch;
    const parsedAddressId = addressId || parsedSearch;

    if (isSearchNumber) {
      searchQuery.push({
        [Op.or]: {
          id: parsedAddressId,
          establishmentId: parsedEstablishmentId,
        },
      });
    } else if (search) {
      searchQuery.push({
        [Op.or]: {
          name: { [Op.substring]: search },
          address: { [Op.substring]: search },
        },
      });
    }
    if (establishmentId) searchQuery.push({ establishmentId });
    if (cityId) searchQuery.push({ cityId });
    if (active) searchQuery.push({ active });

    return {
      where: {
        [Op.and]: searchQuery,
      },
    };
  };

  create = (formattedQuery: IEstablishmentAddressGetParsed) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { where: {} };
  };
}

export default new CreateAddressGetSqlizeQuery();
