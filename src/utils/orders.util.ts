/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
// import { Op } from 'sequelize';
// import { STATUS_PAID, STATUS_WAITING } from '../constants';
// import OrdersModel from '../database/models/Orders.model';
// import PlansModel from '../database/models/Plans.model';
import { PriceUnitAndTypeTotals } from '../interfaces/IOrder';
// import {
//   IOrderProductsInMonth,
//   IOrderValidatePlan,
//   PriceUnitAndTypeTotals,
// } from '../interfaces/IOrder';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CustomError, { vouchersNotEnough, vouchersUnavailable } from './customError.util';
// import CustomError, { amountUnauthorized, vouchersNotEnough, vouchersUnavailable } from './customError.util';
// import dateUtils from './date.utils';
// import OrdersProductsModel from '../database/models/OrdersProducts.model';
// import EstablishmentsProductsModel from '../database/models/EstablishmentsProducts.model';

class Orders {
  validateOrderAmount = (productInfo: IProductFromGetById, amountRequested: number) => {
    const { vouchersAvailable, soldOutAmount } = productInfo;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(soldOutAmount);

    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersUnavailable);

    const areVouchersBelowRequestedQty = Number(soldOutAmount) 
      > totalVouchersAvailable - amountRequested;
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersNotEnough);
  };

  // validatePlanAmount = async ({ userId, cinemaPlan, orderTotals }: IOrderValidatePlan) => {
  //   const planInfo = await PlansModel.findOne({ where: { name: cinemaPlan } });

  //   const currentDate = new Date();
  //   const firstDayOfMonth = dateUtils.getFirstDayOfMonth(currentDate);
  //   const lastDayOfMonth = dateUtils.getLastDayOfMonth(currentDate);

  //   const userOrdersInCurrentMonth = await OrdersModel.findAll({
  //     include: [
  //       {
  //         model: OrdersProductsModel,
  //         as: 'productsDetails',
  //         required: false,
  //         attributes: {
  //           exclude: ['orderId'],
  //         },
  //         include: [
  //           {
  //             model: EstablishmentsProductsModel,
  //             as: 'productInfo',
  //             attributes: {
  //               exclude: ['id'],
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //     where: {
  //       userId,
  //       updatedAt: {
  //         [Op.gte]: firstDayOfMonth,
  //         [Op.lte]: lastDayOfMonth,
  //       },
  //       status: {
  //         [Op.or]: [STATUS_PAID, STATUS_WAITING],
  //       },
  //     },
  //   }) as unknown as IOrderProductsInMonth;

  //   const userTotalsInCurrentMonth = userOrdersInCurrentMonth.productsDetails.reduce(
  //     (accTotal, currProduct) => {
  //       const { type } = currProduct.productInfo;
        
  //       const newAccTotal = {
  //         [type]: accTotal[type] ? accTotal[type] + 1 : 1,
  //       };
  //       return newAccTotal;
  //     },
  //     {} as Pick<PriceUnitAndTypeTotals, number>,
  //   );
  //   // const isUserRequestOverPlanLimit =
  //   //   totalConsumablesInCurrentMonth + orderTotals.totalConsumables >
  //   //     planInfo?.dataValues.limitPerType ||
  //   //   totalTicketsInCurrentMonth + orderTotals.totalTickets > planInfo?.dataValues.limitPerType;

  //   if (isUserRequestOverPlanLimit) throw new CustomError(amountUnauthorized);
  // };

  calculateOrderTotals = (productsInfo: IProductWithRequestedVouchers[]) => {
    const totals = productsInfo.reduce(
      (accTotals, currProduct) => {
        const subTotal = currProduct.price * currProduct.vouchersRequested.length;
        const totalPrice = accTotals.totalPrice + subTotal;

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
          totalPrice: Number(totalPrice.toFixed(2)),
          totalUnits,
          [currProduct.type as keyof PriceUnitAndTypeTotals]: totalOfType,
        };

        return newAccTotals;
      },
      { totalPrice: 0, totalUnits: 0 } as PriceUnitAndTypeTotals,
    );

    return totals;
  };
}

export default new Orders();
