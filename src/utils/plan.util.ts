/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines-per-function */

import { Op } from 'sequelize';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import OrdersModel from '../database/models/Orders.model';
import OrdersProductsModel from '../database/models/OrdersProducts.model';
import dateUtils from './date.utils';
import { STATUS_PAID, STATUS_WAITING } from '../constants';
import { IOrderProductsInMonth, PriceUnitAndTypeTotals, TypeId } from '../interfaces/IOrder';
import { IPlanUsedAmount, IPlanTypeUsedInfo, IPlanInfo } from '../interfaces/IPlan';
import PlansModel from '../database/models/Plans.model';
import PlansProductsTypes from '../database/models/PlansProductsTypes';
import ProductsTypesModel from '../database/models/ProductsTypes.model';
import CustomError, { totalError } from './customError.util';
import ImageFormatter from './formatImages.util';

class Plan {
  calculateUserTypesPerMonth = async ({ userId, cinemaPlan }: IPlanUsedAmount) => {
    try {
      const planInfo = await PlansModel.findOne({
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
        where: { id: cinemaPlan },
      }) as IPlanInfo;

      const currentDate = new Date();
      const firstDayOfMonth = dateUtils.getFirstDayOfMonth(currentDate);
      const lastDayOfMonth = dateUtils.getLastDayOfMonth(currentDate);

      const userOrdersInCurrentMonth = await OrdersModel.findAll({
        include: [
          {
            model: OrdersProductsModel,
            as: 'productsDetails',
            required: false,
            attributes: {
              exclude: ['orderId'],
            },
            include: [
              {
                model: EstablishmentsProductsModel,
                as: 'productInfo',
                attributes: {
                  exclude: ['productId'],
                },
              },
            ],
          },
        ],
        where: {
          userId,
          updatedAt: {
            [Op.gte]: firstDayOfMonth,
            [Op.lte]: lastDayOfMonth,
          },
          status: {
            [Op.or]: [STATUS_PAID, STATUS_WAITING],
          },
        },
      }) as IOrderProductsInMonth;

      const userTypeTotalsInCurrentMonth = userOrdersInCurrentMonth.reduce(
        (accTotalInMonth, currOrder) => {
          const { productsDetails } = currOrder;

          const productsTypeTotalsInCurrOrder = productsDetails.reduce(
            (accTotalInOrder, currProduct) => {
              const { productInfo: { type }, quantity } = currProduct;

              const newAccTotalInOrder = {
                ...accTotalInOrder,
                [type]: accTotalInOrder[type] ? accTotalInOrder[type] + quantity : quantity,
              };

              return newAccTotalInOrder;
            },
            {} as Pick<PriceUnitAndTypeTotals, TypeId>,
          );

          const typesInOrder = Object.keys(productsTypeTotalsInCurrOrder)
            .map((type) => Number(type));
          const newAccTotalInMonth = typesInOrder.reduce(
            (newAcc, currType) => ({
              ...newAcc,
              [currType]: newAcc[currType]
                ? newAcc[currType] + productsTypeTotalsInCurrOrder[currType]
                : productsTypeTotalsInCurrOrder[currType],
            }),
            accTotalInMonth,
          );

          return newAccTotalInMonth;
        },
        {} as Pick<PriceUnitAndTypeTotals, TypeId>,
      );

      return { planInfo, userTypeTotalsInCurrentMonth };
    } catch (error) {
      throw new CustomError(totalError);
    }
  };

  formatUserTypesPerMonth = async ({ userId, cinemaPlan }: IPlanUsedAmount) => {
    const { userTypeTotalsInCurrentMonth, planInfo } = await this.calculateUserTypesPerMonth({
      userId,
      cinemaPlan,
    });

    const usedTypesInfo = planInfo.planDetails.reduce((accTypeUseInfo, currType) => {
      const {
        productTypeId,
        quantity,
        type: { name, icon },
      } = currType;

      const currTypeUseInfo: IPlanTypeUsedInfo = {
        typeId: productTypeId,
        typeName: name,
        typeIcon: ImageFormatter.formatUrl({ imageName: icon }),
        planMaxAmount: quantity,
        usedAmount: userTypeTotalsInCurrentMonth[productTypeId] || 0,
      };

      const newAcc = [...accTypeUseInfo, currTypeUseInfo];

      return newAcc;
    }, [] as IPlanTypeUsedInfo[]);

    return usedTypesInfo;
  };
}

export default new Plan();
