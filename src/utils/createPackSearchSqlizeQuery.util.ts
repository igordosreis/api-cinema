/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
// import { Op } from 'sequelize';
import { Op } from 'sequelize';
import { IPackSearchQuery } from '../interfaces/IPacks';

class CreatePackSearchSqlizeQuery {
  private addParams = ({ establishmentId, active }: IPackSearchQuery) => {
    const searchQuery = [];
    // if (term) {
    //   searchQuery.push({
    //     [Op.or]: {
    //       name: { [Op.substring]: term },
    //       description: { [Op.substring]: term },
    //       '$packInfo.productDetails.name$': { [Op.substring]: term },
    //       '$packInfo.productDetails.description$': { [Op.substring]: term },
    //     },
    //   });
    // }
    // if (type) searchQuery.push({ '$packInfo.productDetails.type$': { [Op.eq]: type } });
    // if (type) {
    //   searchQuery.push(
    //     sequelize.literal(`
    //       EXISTS (
    //         SELECT 1
    //         FROM packs AS pa
    //         JOIN packs_products AS pp
    //         JOIN establishments_products AS pr
    //         WHERE
    //           pa.id = pp.pack_id
    //           AND pr.type = ${type}
    //       )
    //     `),
    //   );
    // }
    if (establishmentId) {
      searchQuery.push({
        '$packInfo.productDetails.establishment_id$': { [Op.eq]: establishmentId },
      });
    }
    if (active) searchQuery.push({ active });

    return {
      where: {
        [Op.and]: searchQuery,
      },
      // having: available
      //   ? sequelize.literal('(packs.is_limited = true AND packs.counter < packs.counter_limit) OR (packs.is_limited = false AND COUNT(packInfo.productDetails.vouchersAvailable.id) > packInfo.productDetails.sold_out_amount)')
      //   // ? sequelize.literal('(packs.is_limited = true AND packs.counter < packs.counter_limit) ')
      //   : {},

      // having: type
      //   ? sequelize.literal(`CASE WHEN \`packInfo.productDetails.type\` = ${type} THEN 1 ELSE 0 END > 0`)

      //   : {},
    };
  };

  create = (packSearchQuery: IPackSearchQuery) => {
    const areThereAnyParams = Object.values(packSearchQuery).some((param) => param);

    return areThereAnyParams ? this.addParams(packSearchQuery) : { where: {} };
  };
}

export default new CreatePackSearchSqlizeQuery();
