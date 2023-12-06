/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/naming-convention */
import { MINIMUM_VOUCHER_QUANTITY } from '../constants';
import {
  IProductFromGetById,
  IProductWithSelectedVouchers,
} from '../interfaces/IProducts';
import CustomError, { vouchersNotEnough, vouchersUnavailable } from './customError.util';

type Totals = 'totalPrice' | 'totalUnits' | 'totalConsumables' | 'totalTickets';
type PriceUnitAndTypeTotals = Record<Totals, number>;

class Orders {
  validateVouchersAmount = (productInfo: IProductFromGetById, amountRequested: number) => {
    const { vouchersAvailable } = productInfo;

    const totalVouchersAvailable = vouchersAvailable.length;
    const areVouchersBelowMinimumQty = totalVouchersAvailable < Number(MINIMUM_VOUCHER_QUANTITY);
    if (areVouchersBelowMinimumQty) throw new CustomError(vouchersUnavailable);

    const areVouchersBelowRequestedQty = Number(MINIMUM_VOUCHER_QUANTITY)
      > totalVouchersAvailable - amountRequested;
    if (areVouchersBelowRequestedQty) throw new CustomError(vouchersNotEnough);
  };

  calculateTotalPriceAndTotalUnits = (productsInfo: IProductWithSelectedVouchers[]) => {
    const totals = productsInfo.reduce(
      (accTotals, currProduct) => {
        const subTotal = currProduct.price * currProduct.vouchersSelected.length;
        const totalPrice = accTotals.totalPrice + subTotal;

        const totalUnits = accTotals.totalUnits + currProduct.vouchersSelected.length;

        const formattedType = `total${currProduct.type.charAt(0).toUpperCase()}${currProduct.type.slice(1)}s`;
        const totalOfType = productsInfo
          .filter(({ type }) => type === currProduct.type)
          .reduce((accTypeTotal, currType) => (accTypeTotal + currType.vouchersSelected.length), 0);

        const newAccTotals = { 
          ...accTotals,
          totalPrice: Number(totalPrice.toFixed(2)),
          totalUnits,
          [formattedType as keyof PriceUnitAndTypeTotals]: totalOfType, 
        };
        console.log('- - - --- - - -- -- - --- -- - --  -- --- - newAccTotals: ', newAccTotals);

        return newAccTotals;
      },
      { totalPrice: 0, totalUnits: 0 } as PriceUnitAndTypeTotals,
    );

    return totals;
  };
}

export default new Orders();
