/* eslint-disable max-lines-per-function */
import PlansModel from '../database/models/Plans.model';
import PlansProductsTypes from '../database/models/PlansProductsTypes';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import CustomError, { planNotFound } from '../utils/customError.util';

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

  public static async getPlanById(planId: number) {
    const plan = await PlansModel.findOne({
      include: [
        {
          model: PlansProductsTypes,
          as: 'planDetails',
          attributes: {
            exclude: ['planId'],
          },
          include: [
            {
              model: ProductsTypesModel,
              as: 'type',
              attributes: {
                exclude: ['id'],
              },
            },
          ],
        },
      ],
      where: { id: planId },
    });

    const isPlanNotFound = !plan;
    if (isPlanNotFound) throw new CustomError(planNotFound);

    return plan;
  }
}
