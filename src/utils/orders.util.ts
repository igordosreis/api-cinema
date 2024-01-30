/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { Transaction } from 'sequelize';
import {
  IOrderValidatePlan,
  PriceUnitAndTypeTotals,
  IParsedOrderWithProducts,
  IOrderRequestInfo,
} from '../interfaces/IOrder';
import { IProductFromGetById, IProductWithRequestedVouchers } from '../interfaces/IProducts';
import CartService from '../services/Cart.service';
import CustomError, { amountUnauthorized, badCartObject, cartIsEmpty, openOrder, vouchersNotEnough, vouchersUnavailable } from './customError.util';
import planUtil from './plan.util';
import OrdersModel from '../database/models/Orders.model';
import { STATUS_WAITING } from '../constants';

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
    const { userTypeTotalsInCurrentMonth, planInfo } = await planUtil.calculateUserTypesPerMonth({
      userId,
      cinemaPlan,
    });
   
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

      const isProduct = 'productId' in currItem;
      if (isProduct) {
        const { price, amountRequested } = currItem;
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

  getCartFormatted = async (userId: number): Promise<IOrderRequestInfo[]> => {
    const currentCart = await CartService.getCart({ userId });

    const isCartEmpty = currentCart.length === 0;
    console.log(`---                       currentCart:            
    `, currentCart);
    console.log(`---                       isCartEmpty:            
    `, isCartEmpty);
    if (isCartEmpty) throw new CustomError(cartIsEmpty);

    const formattedCart = currentCart.map(({ productId, packId, quantity, establishmentId }) => {
      if (productId) {
        const parsedProduct = {
          establishmentId,
          productId,
          amountRequested: quantity,
        };

        return parsedProduct;
      } 

      if (packId) {
        const parsedPack = {
          establishmentId,
          packId,
          amountRequested: quantity,
        };
  
        return parsedPack;
      } 

      throw new CustomError(badCartObject);
    });

    return formattedCart;
  };

  verifyIfAllOrdersAreFinalized = async (
    { userId, transaction }:
    { userId: number, transaction?: Transaction },
  ) => {
    const allUserOrders = await OrdersModel.findAll({ where: { userId }, transaction });

    const isAnyOrderOpen = allUserOrders.some(({ status }) => status === STATUS_WAITING);
    if (isAnyOrderOpen) {
      throw new CustomError(openOrder);
    }
  };
}

export default new Orders();
