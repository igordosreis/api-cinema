import PlansModel from '../database/models/Plans.model';
import PlansProductsTypes from '../database/models/PlansProductsTypes';
import ProductsTypesModel from '../database/models/ProductsTypes.model';

export default class PlansService {
  public static async getAllPlans() {
    // const allPlans = await PlansModel.findAll({
    //   include: [
    //     {
    //       model: PlansProductsTypes,
    //       as: 'planDetails',
    //       include: [
    //         {
    //           model: ProductsTypesModel,
    //           as: 'type',
    //         },
    //       ],
    //     },
    //   ],
    // });
    const allPlans = await PlansProductsTypes.findAll({
      include: [
        {
          model: PlansModel,
          as: 'planDetails',
        },
        {
          model: ProductsTypesModel,
          as: 'type',
        },
      ],
    });

    return allPlans;
  }
}
