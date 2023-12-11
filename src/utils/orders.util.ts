/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Op } from 'sequelize';
import { MINIMUM_VOUCHER_QUANTITY, STATUS_PAID, STATUS_WAITING } from '../constants';
import OrdersModel from '../database/models/Orders.model';
import PlansModel from '../database/models/Plans.model';
import { IOrderValidatePlan, PriceUnitAndTypeTotals } from '../interfaces/IOrder';
import {
  IProductFromGetById,
  IProductWithRequestedVouchers,
} from '../interfaces/IProducts';
import CustomError, { amountUnauthorized, vouchersNotEnough, vouchersUnavailable } from './customError.util';
import dateUtils from './date.utils';

class Orders {
  validateOrderAmount = (productInfo: IProductFromGetById, amountRequested: number) => {
    const { vouchersAvailable } = productInfo;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(MINIMUM_VOUCHER_QUANTITY);
    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersUnavailable);

    const areVouchersBelowRequestedQty = Number(MINIMUM_VOUCHER_QUANTITY)
      > totalVouchersAvailable - amountRequested;
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersNotEnough);
  };

  validatePlanAmount = async ({ userId, cinemaPlan, orderTotals }: IOrderValidatePlan) => {
    const planInfo = await PlansModel.findOne({ where: { name: cinemaPlan } });

    const currentDate = new Date();
    const firstDayOfMonth = dateUtils.getFirstDayOfMonth(currentDate);
    const lastDayOfMonth = dateUtils.getLastDayOfMonth(currentDate);

    const userOrderInCurrentMonth = await OrdersModel.findAll({
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
    });
    const userTotalsInCurrentMonth = userOrderInCurrentMonth.reduce((accTotal, currOrder) => {
      const orderInfo: OrdersModel = currOrder.dataValues;
      const newAccTotal = {
        totalConsumables: accTotal.totalConsumables + orderInfo.totalConsumables,
        totalTickets: accTotal.totalTickets + orderInfo.totalTickets,
      };

      return newAccTotal;
    }, { totalConsumables: 0, totalTickets: 0 } as Pick<PriceUnitAndTypeTotals, 'totalConsumables' | 'totalTickets'>);

    const {
      totalConsumables: totalConsumablesInCurrentMonth,
      totalTickets: totalTicketsInCurrentMonth,
    } = userTotalsInCurrentMonth;
    const isUserRequestOverPlanLimit = totalConsumablesInCurrentMonth + orderTotals.totalConsumables > planInfo?.dataValues.limitPerType
      || totalTicketsInCurrentMonth + orderTotals.totalTickets > planInfo?.dataValues.limitPerType;

    if (isUserRequestOverPlanLimit) throw new CustomError(amountUnauthorized);
  };

  calculateOrderTotals = (productsInfo: IProductWithRequestedVouchers[]) => {
    const totals = productsInfo.reduce(
      (accTotals, currProduct) => {
        const subTotal = currProduct.price * currProduct.vouchersRequested.length;
        const totalPrice = accTotals.totalPrice + subTotal;

        const totalUnits = accTotals.totalUnits + currProduct.vouchersRequested.length;

        const formattedType = `total${currProduct.type.charAt(0).toUpperCase()}${currProduct.type.slice(1)}s`;
        const isTotalOfTypeAlreadyCalculated = accTotals[formattedType as keyof PriceUnitAndTypeTotals];
        const totalOfType = isTotalOfTypeAlreadyCalculated || productsInfo
          .filter(({ type }) => type === currProduct.type)
          .reduce((accTypeTotal, currType) => (accTypeTotal + currType.vouchersRequested.length), 0);

        const newAccTotals = { 
          ...accTotals,
          totalPrice: Number(totalPrice.toFixed(2)),
          totalUnits,
          [formattedType as keyof PriceUnitAndTypeTotals]: totalOfType, 
        };

        return newAccTotals;
      },
      { totalPrice: 0, totalUnits: 0, totalConsumables: 0, totalTickets: 0 } as PriceUnitAndTypeTotals,
    );

    return totals;
  };
}

export default new Orders();
