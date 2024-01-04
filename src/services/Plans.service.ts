/* eslint-disable max-lines-per-function */
import PlansModel from '../database/models/Plans.model';
import PlansProductsTypes from '../database/models/PlansProductsTypes';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import { IPlanInfo, IPlanUsedAmount } from '../interfaces/IPlan';
import CustomError, { planNotFound } from '../utils/customError.util';
import planUtil from '../utils/plan.util';

export default class PlansService {
  public static async getAllPlans() {
    const allPlans = await PlansModel.findAll({
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
    });

    return allPlans as IPlanInfo[];
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

    return plan as IPlanInfo;
  }

  public static async getUserTypesPerMonth({ userId, cinemaPlan }: IPlanUsedAmount) {
    const userTypesPerMonth = planUtil.formatUserTypesPerMonth({ userId, cinemaPlan });

    return userTypesPerMonth;
  }
}
