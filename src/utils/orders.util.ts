/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Op } from 'sequelize';
import { STATUS_PAID, STATUS_WAITING } from '../constants';
import OrdersModel from '../database/models/Orders.model';
import {
  IOrderProductsInMonth,
  IOrderValidatePlan,
  PriceUnitAndTypeTotals,
  TypeId,
  IParsedOrderWithProducts,
} from '../interfaces/IOrder';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CustomError, { amountUnauthorized, vouchersNotEnough, vouchersUnavailable } from './customError.util';
import dateUtils from './date.utils';
import OrdersProductsModel from '../database/models/OrdersProducts.model';
import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';
import PlansService from '../services/Plans.service';

class Orders {
  validateRequestedAmount = (productInfo: IProductFromGetById, amountRequested: number) => {
    const { vouchersAvailable, soldOutAmount } = productInfo;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(soldOutAmount);

    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersUnavailable);

    const areVouchersBelowRequestedQty = Number(soldOutAmount) 
      > totalVouchersAvailable - amountRequested;
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersNotEnough);
  };

  validatePlanAmount = async ({ userId, cinemaPlan, orderTotals }: IOrderValidatePlan) => {
    const planInfo = await PlansService.getPlanById(cinemaPlan);

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
                exclude: ['id'],
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
            const { type } = currProduct.productInfo;
            
            const newAccTotalInOrder = {
              ...accTotalInOrder,
              [type]: accTotalInOrder[type] ? accTotalInOrder[type] + 1 : 1,
            };

            return newAccTotalInOrder;
          },
          {} as Pick<PriceUnitAndTypeTotals, TypeId>,
        );
        
        const typesInOrder = Object.keys(productsTypeTotalsInCurrOrder).map((type) => Number(type));
        const newAccTotalInMonth = typesInOrder.reduce((newAcc, currType) => ({
          ...newAcc,
          [currType]: newAcc[currType] 
            ? newAcc[currType] + productsTypeTotalsInCurrOrder[currType]
            : productsTypeTotalsInCurrOrder[currType],
        }), accTotalInMonth);
        // const newAccTotalInMonth = typesInOrder.reduce((newAcc, currType) => (
        //   newAcc[currType]
        //     ? {
        //       ...newAcc,
        //       [currType]: newAcc[currType] + productsTypeTotalsInCurrOrder[currType],
        //     }
        //     : {
        //       ...newAcc,
        //       [currType]: productsTypeTotalsInCurrOrder[currType],
        //     }
        // ), accTotalInMonth);

        return newAccTotalInMonth;
      },
      {} as Pick<PriceUnitAndTypeTotals, TypeId>,
    );

    planInfo.planDetails.forEach((planDetail) => {
      const { productTypeId, quantity, type: { name } } = planDetail;
      
      const userTypeTotal = (userTypeTotalsInCurrentMonth[productTypeId] || 0) + orderTotals[productTypeId];
      const isUserTypeTotalOverPlanLimit = userTypeTotal > quantity;

      if (isUserTypeTotalOverPlanLimit) throw new CustomError(amountUnauthorized(name));
    });
  };

  calculateOrderTotals = (
    productsInfo: IProductWithRequestedVouchers[],
    parsedOrder: IParsedOrderWithProducts[],
  ): PriceUnitAndTypeTotals => {
    const unitAndTypeTotals = productsInfo.reduce(
      (accTotals, currProduct) => {
        // const subTotal = currProduct.price * currProduct.vouchersRequested.length;
        // const totalPrice = accTotals.totalPrice + subTotal;

        const totalUnits = accTotals.totalUnits + currProduct.vouchersRequested.length;

        const isTotalOfTypeAlreadyCalculated = accTotals[currProduct.type as keyof PriceUnitAndTypeTotals];
        const totalOfType = isTotalOfTypeAlreadyCalculated || productsInfo
          .filter(({ type }) => type === currProduct.type)
          .reduce(
            (accTypeTotal, currType) => accTypeTotal + currType.vouchersRequested.length,
            0,
          );

        const newAccTotals = {
          ...accTotals,
          // totalPrice: Number(totalPrice.toFixed(2)),
          totalUnits,
          [currProduct.type as keyof PriceUnitAndTypeTotals]: totalOfType,
        };

        return newAccTotals;
      },
      { totalUnits: 0 } as PriceUnitAndTypeTotals,
    );
    const priceTotal = parsedOrder.reduce((accPrice, currItem) => {
      const isPack = 'pack' in currItem;
      if (isPack) {
        const { pack: { price }, amountRequested } = currItem;
        const subTotal = price * amountRequested;
        const totalPrice = accPrice.totalPrice + subTotal;

        return { totalPrice: Number(totalPrice.toFixed(2)) };
      }

      const isProduct = 'id' in currItem;
      if (isProduct) {
        const { price, amountRequested } = currItem;
        console.log('- -- - -- -- - -- - -- -- - -- - -- -- amountRequested:    ', amountRequested);
        const subTotal = price * (amountRequested || 1);
        const totalPrice = accPrice.totalPrice + subTotal;

        return { totalPrice: Number(totalPrice.toFixed(2)) };
      }

      return accPrice;
    }, { totalPrice: 0 } as Pick<PriceUnitAndTypeTotals, 'totalPrice'>);

    return {
      ...unitAndTypeTotals,
      ...priceTotal,
    };
  };
}

export default new Orders();
