/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
import { Op } from 'sequelize';
import { IVouchersGetDashboardParsed } from '../interfaces/IVouchers';

class CreateVouchersGetSqlizeQuery {
  private getVoucherTypeReturn = ({
    search,
    voucherType,
  }: IVouchersGetDashboardParsed) => {
    if (search && (voucherType === 'available' || voucherType === undefined)) {
      const obj = { 
        [Op.or]: {
          voucherCode: { [Op.substring]: search },
          '$brand.name$': { [Op.substring]: search },
          '$vouchersAvailable.name$': { [Op.substring]: search },
        },
      };
      
      return obj;
    }

    if (search && (voucherType === 'user')) {
      const obj = { 
        [Op.or]: {
          voucherCode: { [Op.substring]: search },
          '$brand.name$': { [Op.substring]: search },
          '$productVoucherInfo.name$': { [Op.substring]: search },
        },
      };

      return obj;
    }

    if (search && (voucherType === 'withdraw')) {
      const obj = { 
        [Op.or]: {
          voucherCode: { [Op.substring]: search },
          '$brand.name$': { [Op.substring]: search },
          '$vouchersWithdraw.name$': { [Op.substring]: search },
        },
      };

      return obj;
    }
  };

  private addParams = (params: IVouchersGetDashboardParsed) => {
    const {
      productId,
      establishmentId,
      search,
    } = params;

    const searchQuery = [];
    if (productId) searchQuery.push({ productId });
    if (establishmentId) searchQuery.push({ establishmentId });
    if (search) {
      const isSearchNumber = Number(search);
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
        searchQuery.push(this.getVoucherTypeReturn(params));
      }
    }

    return {
      where: {
        [Op.and]: searchQuery,
      },
    };
  };

  create = (formattedQuery: IVouchersGetDashboardParsed) => {
    const areThereAnyParams = Object.values(formattedQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(formattedQuery) : { where: {} };
  };
}

export default new CreateVouchersGetSqlizeQuery();
